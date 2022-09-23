import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import isString from "lodash/isString";
import { ReactNode } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { CustomFile } from "../interface/common";
import RejectionFiles from "./RejectionFiles";

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  overflow: "hidden",
  position: "relative",
  height: 200,
  padding: theme.spacing(3, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("padding"),
  backgroundColor: "#F4F6F8",
  border: `1px dashed alpha('#919EAB', 0.32)`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

interface UploadSingleFileProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile | string;
  helperText: ReactNode | string;
  sx?: SxProps<Theme>;
}

function UploadSingleFile({
  error = false,
  file,
  helperText,
  sx,
  ...other
}: UploadSingleFileProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: true,
    ...other,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && {
            padding: "5% 0",
          }),
        }}
      >
        <input {...getInputProps()} />

        <Stack
          direction="column"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          {!file && (
            <>
              <AddAPhotoRoundedIcon />
              <Typography
                gutterBottom
                variant="body2"
                sx={{ color: "#637381" }}
                textAlign="center"
              >
                Drop or Select Image
              </Typography>
            </>
          )}
        </Stack>

        {file && (
          <Box
            sx={{
              top: 8,
              left: 8,
              borderRadius: 1,
              position: "absolute",
              width: "calc(100% - 16px)",
              height: "calc(100% - 16px)",
              overflow: "hidden",
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img
              alt="file preview"
              src={isString(file) ? file : file.preview}
            />
          </Box>
        )}
      </DropZoneStyle>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      {helperText && helperText}
    </Box>
  );
}

export default UploadSingleFile;
