import { FormControlLabel, FormControlLabelProps, Switch } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface FSwitchProps extends Omit<FormControlLabelProps, "control"> {
  name: string;
}

function FSwitch({ name, ...other }: FSwitchProps) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Switch {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}

export default FSwitch;
