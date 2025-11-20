import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import type { LineStyle } from "../../types/abTest";
import { options } from "../../consts";

interface LineStyleSelectorProps {
  value: LineStyle;
  onChange: (style: LineStyle) => void;
}

export const LineStyleSelector = ({
  value,
  onChange,
}: LineStyleSelectorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange((event.target as HTMLInputElement).value as LineStyle);
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
          {options.map((option) => (
            <FormControlLabel
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};
