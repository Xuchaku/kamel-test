import { Button, Stack } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import type { Variation, VariationId } from "../../types/abTest";

interface VariationSelectorProps {
  variations: Variation[];
  selected: VariationId[];
  onToggle: (id: VariationId) => () => void;
}

export const VariationSelector = ({
  variations,
  selected,
  onToggle,
}: VariationSelectorProps) => {
  return (
    <Stack direction={"row"} gap={1}>
      {variations.map((variation) => {
        const active = selected.includes(variation.id);
        return (
          <Button
            variant={active ? "contained" : "text"}
            onClick={onToggle(variation.id)}
            startIcon={<CircleIcon sx={{ color: variation.color }} />}
          >
            {variation.name}
          </Button>
        );
      })}
    </Stack>
  );
};
