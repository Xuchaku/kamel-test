import type {
  ChartPoint,
  Granularity,
  Variation,
  VariationId,
  VariationMetrics,
} from '../types/abTest';
import type { RawDataPoint } from '../types/abTest';

const dayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
});

const tooltipFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const rangeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
});

const rate = (conversions?: number, visits?: number): number | null => {
  if (typeof conversions !== 'number' || typeof visits !== 'number' || visits <= 0) {
    return null;
  }

  return Number(((conversions / visits) * 100).toFixed(2));
};

const parseDate = (value: string) => new Date(`${value}T00:00:00Z`);

const buildDailyPoints = (rows: RawDataPoint[], variations: Variation[]): ChartPoint[] =>
  rows.map((row) => {
    const date = parseDate(row.date);
    const label = dayFormatter.format(date);
    const tooltipLabel = tooltipFormatter.format(date);

    const meta: ChartPoint['meta'] = {};
    const values: ChartPoint['values'] = {};
    const result: ChartPoint = {
      id: row.date,
      date,
      label,
      tooltipLabel,
      meta,
      values,
    };

    variations.forEach((variation) => {
      const visits = row.visits?.[variation.id];
      const conversions = row.conversions?.[variation.id];
      const metric: VariationMetrics = {
        visits: typeof visits === 'number' ? visits : null,
        conversions: typeof conversions === 'number' ? conversions : null,
        rate: rate(conversions, visits),
      };

      values[variation.id] = metric.rate;
      meta[variation.id] = metric;
    });

    return result;
  });

const getIsoWeekInfo = (date: Date) => {
  const tmp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  const start = new Date(tmp);
  start.setUTCDate(tmp.getUTCDate() - (tmp.getUTCDay() || 7) + 1);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return {
    year: tmp.getUTCFullYear(),
    week,
    start,
    end,
  };
};

const buildWeeklyPoints = (dailyPoints: ChartPoint[], variations: Variation[]): ChartPoint[] => {
  const buckets = new Map<
    string,
    {
      id: string;
      date: Date;
      label: string;
      tooltipLabel: string;
      rangeLabel: string;
      totals: Record<VariationId, { visits: number; conversions: number }>;
    }
  >();

  dailyPoints.forEach((point) => {
    const { year, week, start, end } = getIsoWeekInfo(point.date);
    const key = `${year}-W${String(week).padStart(2, '0')}`;

    if (!buckets.has(key)) {
      const totals: Record<VariationId, { visits: number; conversions: number }> = {};
      variations.forEach((variation) => {
        totals[variation.id] = { visits: 0, conversions: 0 };
      });

      buckets.set(key, {
        id: key,
        date: start,
        label: `W${String(week).padStart(2, '0')}`,
        tooltipLabel: `Week ${String(week).padStart(2, '0')}`,
        rangeLabel: `${rangeFormatter.format(start)} - ${rangeFormatter.format(end)}`,
        totals,
      });
    }

    const bucket = buckets.get(key);
    if (!bucket) return;

    variations.forEach((variation) => {
      const dailyMetrics = point.meta[variation.id];
      if (!dailyMetrics || dailyMetrics.visits === null || dailyMetrics.conversions === null) {
        return;
      }

      bucket.totals[variation.id].visits += dailyMetrics.visits;
      bucket.totals[variation.id].conversions += dailyMetrics.conversions;
    });
  });

  return Array.from(buckets.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((bucket) => {
      const meta: ChartPoint['meta'] = {};
      const values: ChartPoint['values'] = {};
      const chartPoint: ChartPoint = {
        id: bucket.id,
        date: bucket.date,
        label: bucket.label,
        tooltipLabel: bucket.tooltipLabel,
        rangeLabel: bucket.rangeLabel,
        meta,
        values,
      };

      variations.forEach((variation) => {
        const totals = bucket.totals[variation.id];
        const computedRate = rate(totals.conversions, totals.visits);
        meta[variation.id] = {
          visits: totals.visits || null,
          conversions: totals.conversions || null,
          rate: computedRate,
        };
        values[variation.id] = computedRate;
      });

      return chartPoint;
    })
    .filter((point) => variations.some((variation) => point.values[variation.id] !== null));
};

export const buildChartData = (rows: RawDataPoint[], variations: Variation[]) => {
  const day = buildDailyPoints(rows, variations);
  const week = buildWeeklyPoints(day, variations);

  return { day, week };
};

export const getVisibleData = (
  data: ChartPoint[],
  selectedVariations: VariationId[],
): ChartPoint[] =>
  data.filter((point) => selectedVariations.some((variationId) => point.values[variationId] !== null));

export const granularityOrder: Granularity[] = ['day', 'week'];

