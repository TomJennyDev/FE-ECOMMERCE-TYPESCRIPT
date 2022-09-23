import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
// @mui
import { alpha } from "@mui/material/styles";
import { AnimatePresence, m } from "framer-motion";
import isString from "lodash/isString";
import { CustomFile } from "../interface/common";

// utils
//
import { fData } from "../utils/numberFormat";
import { varFade } from "./animate/variants/fade";
import Iconify from "./Iconify";

const getFileData = (file: CustomFile | string) => {
  if (typeof file === "string") {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
  };
};

interface MultiFilePreviewProps {
  showPreview: boolean;
  files: (CustomFile | string)[];
  onRemove?: (file: CustomFile | string) => void;
  onRemoveAll?: VoidFunction;
}

export default function MultiFilePreview({
  showPreview = false,
  files,
  onRemove,
  onRemoveAll,
}: MultiFilePreviewProps) {
  const hasFile = files?.length > 0;

  return (
    <>
      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        <AnimatePresence>
          {files?.map((file) => {
            const { key, name, size, preview } = getFileData(file);
            if (showPreview) {
              return (
                <ListItem
                  key={key}
                  component={"div"}
                  {...varFade().inRight}
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 150,
                    height: 200,
                    borderRadius: 1.25,
                    overflow: "hidden",
                    position: "relative",
                    display: "inline-flex",
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <img src={isString(file) ? file : preview} />
                  {/* <img src={file} /> */}
                  <IconButton
                    size="small"
                    onClick={() => onRemove?.(file)}
                    sx={{
                      top: 6,
                      p: "2px",
                      right: 6,
                      position: "absolute",
                      color: "common.white",
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon={"eva:close-fill"} />
                  </IconButton>
                </ListItem>
              );
            }

            return (
              <ListItem
                key={key}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.75,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Iconify
                  icon={"eva:file-fill"}
                  sx={{ width: 28, height: 28, color: "text.secondary", mr: 2 }}
                />

                <ListItemText
                  primary={isString(file) ? file : name}
                  secondary={isString(file) ? "" : fData(size || 0)}
                  primaryTypographyProps={{ variant: "subtitle2" }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />

                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => onRemove?.(file)}
                >
                  <Iconify icon={"eva:close-fill"} />
                </IconButton>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>

      {hasFile && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button color="inherit" size="small" onClick={onRemoveAll}>
            Remove all
          </Button>
        </Stack>
      )}
    </>
  );
}
