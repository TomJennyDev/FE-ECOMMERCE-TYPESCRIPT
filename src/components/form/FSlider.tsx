import { FormHelperText, Slider, SliderTypeMap } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface FSliderProps extends SliderTypeMap {
  name: string;
  step?: number;
}

function FSlider({ name, ...other }: FSliderProps) {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <>
              <Slider
                {...field}
                onChange={(_, value: number | number[]) => {
                  field.onChange(value);
                }}
                valueLabelDisplay="auto"
                {...other}
              />
              {!!error && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </>
          );
        }}
      />
    </>
  );
}

export default FSlider;
