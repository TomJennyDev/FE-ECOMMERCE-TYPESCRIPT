import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface FCheckboxProps extends Omit<FormControlLabelProps, "control"> {
  name: string;
}

function FCheckbox({ name, ...other }: FCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}

export default FCheckbox;
