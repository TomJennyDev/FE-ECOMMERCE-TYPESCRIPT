import {
  DateRangePicker,
  DateRangePickerProps,
  LocalizationProvider,
} from "@mui/lab";
import { Box, TextField, TextFieldProps } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Dayjs } from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

interface FMultiDatePickerProps
  extends Omit<DateRangePickerProps<Dayjs>, "onChange" | "value"> {
  name: string;
  label: string;
  size: Pick<TextFieldProps, "size">;
}

export default function FMultiDatePicker({
  name,
  label,
  size,
  startText,
  endText,
  ...other
}: FMultiDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Box>
      <Controller
        name={name}
        control={control}
        render={({
          field: { value, onChange, ...field },
          fieldState: { error },
        }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText={startText}
              endText={endText}
              onChange={(date) => onChange(date)}
              value={value}
              {...field}
              {...other}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField
                    {...startProps}
                    fullWidth
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                  />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField
                    {...endProps}
                    fullWidth
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                  />
                </>
              )}
            />
          </LocalizationProvider>
        )}
      />
    </Box>
  );
}
