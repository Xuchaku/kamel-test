import rawData from '../../data.json';
import type { Variation, RawVariation, RawDataPoint } from '../types/abTest';

const palette = ['#2563eb', '#0ea5e9', '#f97316', '#22c55e', '#9333ea', '#e11d48'];

const normalizeId = (raw: RawVariation, fallbackIndex: number) =>
  raw.id !== undefined ? String(raw.id) : String(fallbackIndex);

export const variations: Variation[] = rawData.variations.map((rawVariation, index) => ({
  id: normalizeId(rawVariation, 0),
  name: rawVariation.name,
  color: palette[index % palette.length],
}));

export const dailyRows: RawDataPoint[] = rawData.data;




