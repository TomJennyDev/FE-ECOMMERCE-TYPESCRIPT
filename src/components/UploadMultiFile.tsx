import { Box, SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { CustomFile } from "../interface/common";
import BlockContent from "./BlockContent";
import MultiFilePreview from "./MultiFilePreview";
import RejectionFiles from "./RejectionFiles";

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

interface UploadMultiFile extends DropzoneOptions {
  error?: boolean;
  files: (CustomFile | string)[];
  showPreview?: boolean;
  onRemove?: (file: CustomFile | string) => void;
  onRemoveAll?: VoidFunction;
  helperText: ReactNode | string;
  sx?: SxProps<Theme>;
}

export default function UploadMultiFile({
  error,
  showPreview = false,
  files,
  onRemove,
  onRemoveAll,
  helperText,
  sx,
  ...other
}: UploadMultiFile) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
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
        }}
      >
        <input {...getInputProps()} />

        <BlockContent />
      </DropZoneStyle>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      <MultiFilePreview
        files={files}
        showPreview={showPreview}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
      />

      {helperText && helperText}
    </Box>
  );
}
