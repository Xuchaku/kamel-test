import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import type { Granularity } from "../../types/abTest";
import { optionsGranul } from "../../consts";

interface GranularityToggleProps {
  value: Granularity;
  onChange: (value: Granularity) => void;
}

export const GranularityToggle = ({
  value,
  onChange,
}: GranularityToggleProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange((event.target as HTMLInputElement).value as Granularity);
  };
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <Stack direction={"row"} gap={1}>
          {optionsGranul.map((option) => (
            <FormControlLabel
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};
