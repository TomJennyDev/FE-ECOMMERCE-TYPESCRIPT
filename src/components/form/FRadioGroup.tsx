import {
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
  name: string;
  options: any[];
  getOptionLabel: {
    [key: any]: string;
  };
};

type FRadioGroupProps = IProps & RadioGroupProps;

function FRadioGroup({
  name,
  options,
  getOptionLabel,
  ...other
}: FRadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <RadioGroup {...field} row {...other}>
            {options.map((option, index) => (
              <FormControlLabel
                key={option}
                value={option || ""}
                control={<Radio />}
                label={
                  Object.keys(getOptionLabel).length
                    ? getOptionLabel[option]
                    : option
                }
              />
            ))}
          </RadioGroup>

          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}

export default FRadioGroup;
