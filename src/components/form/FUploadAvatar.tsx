import { FormHelperText } from "@mui/material";
import { DropzoneOptions } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import UploadAvatar from "../UploadAvatar";

interface FUploadAvatarProps extends DropzoneOptions {
  name: string;
}

function FUploadAvatar({ name, ...other }: FUploadAvatarProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <div>
            <UploadAvatar error={checkError} {...other} file={field.value} />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

export default FUploadAvatar;
