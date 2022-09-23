import { DatePicker, DatePickerProps } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, useFormContext } from "react-hook-form";
import Label from "../Label";

interface FDatePickerProps extends DatePickerProps<Date> {
  name: string;
  label: string;
}
export default function FDatePicker({
  name,
  label,
  ...other
}: FDatePickerProps) {
  const { control } = useFormContext();
  return (
    <Box>
      {label ? <Label>{label}</Label> : ""}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              {...field}
              {...other}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </LocalizationProvider>
        )}
      />
    </Box>
  );
}
