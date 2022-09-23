import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Box, styled } from "@mui/system";
import ImageResize from "quill-image-resize-module-react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FSelect, FTextField } from "../../../components/form";

Quill.register("modules/imageResize", ImageResize);

const STATUS = ["sale", "new", "comming soon"];
const HIDDEN = [
  { value: false, label: "show" },
  { value: true, label: "hide" },
];

const ProductImgStyle = styled("img")(({ theme }) => ({
  width: "50%",
  maxWidth: "200px",
  height: "auto",
  transform: "translate(-50%,-50%) scale(1)",
  top: "50%",
  left: "50%",
  position: "absolute",
  transition: (theme.transitions as any).create(["transform", "hover"], {
    duration: (theme.transitions as any).duration.standard,
  }),
  "&:hover": {
    transform: "translate(-50%,-50%) scale(1.05)",
  },
}));

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

interface ProductFormProps {
  categories;
  product;
  onEditorStateChange;
  editorContent;
  errors;
}

function ProductForm({
  categories,
  product,
  onEditorStateChange,
  editorContent,
  errors,
}: ProductFormProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Box sx={{ position: "relative", minHeight: "300px" }}>
          {product?.imageUrls?.[0] && (
            <ProductImgStyle
              alt={product?.title}
              src={product?.imageUrls?.[0]}
            />
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={8} sx={{ height: "100%" }}>
        <Stack direction="column" spacing={4}>
          <Stack direction="row" spacing={3} sx={{ p: 3 }}>
            <FTextField name="sku" label="SKU" />
          </Stack>
          <Stack direction="row" sx={{ p: 3 }}>
            <FTextField name="title" label="TITLE" />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ p: 3 }}>
            <FTextField name="price" label="PRICE" type="number" />
            <FTextField name="discount" label="DISCOUNT" type="number" />
            <FTextField name="quantity" label="QUANTITY" type="number" />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ p: 3 }}>
            <FSelect name="categoryId" label="CATEGORIES">
              {categories?.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </FSelect>
            <FSelect name="isDeleted" label="HIDDEN">
              {HIDDEN.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FSelect>
            <FSelect name="status" label="STATUS">
              {STATUS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FSelect>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ p: 3 }}>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={onEditorStateChange}
              modules={modules}
              formats={formats}
              bounds={"#root"}
            />
          </Stack>
          <p>{errors.descriptions && "Enter valid content"}</p>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default ProductForm;
