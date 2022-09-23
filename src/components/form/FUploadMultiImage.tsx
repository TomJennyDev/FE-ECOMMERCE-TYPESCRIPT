import { FormHelperText } from "@mui/material";
import { DropzoneOptions } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import UploadMultiFile from "../UploadMultiFile";

interface FUploadMultiFileProps extends DropzoneOptions {
  name: string;
}

export function FUploadMultiFile({ name, ...other }: FUploadMultiFileProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && field.value?.length === 0;

        return (
          <UploadMultiFile
            files={field.value}
            error={checkError}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}
