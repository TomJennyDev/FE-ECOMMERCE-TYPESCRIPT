import { Box, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FileError } from "react-dropzone";
import { CustomFile } from "../interface/common";
import { fData } from "../utils/numberFormat";

interface CustomFileRejection {
  file: CustomFile;
  errors: FileError[];
}

interface RejectionFilesProps {
  fileRejections: CustomFileRejection[];
}

function RejectionFiles({ fileRejections }: RejectionFilesProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: "error.light",
        backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }: CustomFileRejection) => {
        const { path, size } = file;

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>

            {errors.map((error: FileError) => (
              <Typography key={error.code} variant="caption" component="p">
                - {error.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}

export default RejectionFiles;
