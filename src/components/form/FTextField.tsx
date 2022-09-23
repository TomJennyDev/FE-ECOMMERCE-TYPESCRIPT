import { TextField, TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type IProps = {
  name: string;
  label: string;
};
type FTextFieldProps = IProps & TextFieldProps;

function FTextField({ name, label, ...other }: FTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { value, ...restfield } = field;
        return (
          <TextField
            label={label}
            variant="standard"
            value={value || ""}
            {...restfield}
            fullWidth
            error={!!error}
            helperText={error?.message}
            {...other}
          />
        );
      }}
    />
  );
}

export default FTextField;
