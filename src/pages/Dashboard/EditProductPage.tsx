import { yupResolver } from "@hookform/resolvers/yup";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import { concat } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { FormProvider } from "../../components/form";
import LoadingScreen from "../../components/LoadingScreen";
import { getAllCategories } from "../../features/category/categorySlice";
import {
  createProductDashboard,
  getProductDashboard,
  updateProductDashboard
} from "../../features/dashboard/dashboardSlice";
import ProductForm from "../../features/dashboard/Product/ProductForm";
import ProductUpLoadImg from "../../features/dashboard/Product/ProductUploadImg";
import { TitleStyle } from "../../theme/customizations/TitleStyle";
const schema = yup.object({
  sku: yup.string().required(),
  title: yup.string().required(),
  status: yup.string().required(),
  price: yup.number().required(),
  discount: yup.number().required(),
  quantity: yup.number().required(),
  descriptions: yup.string().required(),
  categoryId: yup.string().required(),
  isDeleted: yup.boolean(),
  imageUrls: null,
  imageFile: null,
});
const PROFILE_TABS = [
  {
    value: "Product",
    icon: <AddBoxIcon sx={{ fontSize: 24 }} />,
  },
  {
    value: "Images",
    icon: <CameraAltIcon sx={{ fontSize: 24 }} />,
  },
];

function EditProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const isAdd = location?.pathname.includes("add");
  const isClone = location?.pathname.includes("clone");

  const [currentTab, setCurrentTab] = useState("Product");

  const dispatch = useAppDispatch();
  const { product, isLoading } = useAppSelector((state) => state.dashboard);
  const { categories } = useAppSelector((state) => state.category);

  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  const defaultValues = {
    sku: isAdd ? "" : product?.sku,
    title: isAdd ? "" : product?.title,
    status: isAdd ? "new" : product?.status,
    price: isAdd ? 0 : product?.price,
    discount: isAdd ? 0 : product?.discount,
    quantity: isAdd ? 0 : product?.quantity,
    descriptions: isAdd ? "" : product?.descriptions?.content,
    categoryId: isAdd ? "" : product?.categoryId,
    isDeleted: isAdd ? false : product?.isDeleted,
    imageUrls: isAdd ? [] : product?.imageUrls,
    imageFile: [],
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = methods;

  const editorContent = watch("descriptions");

  const onEditorStateChange = (editorState) => {
    setValue("descriptions", editorState);
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      let oldImageUrl: (File | string)[] = getValues("imageFile");
      const imageUrl = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const newImageUrl: (CustomFile ,string)[] = concat(oldImageUrl, imageUrl);
      setValue("imageFile", newImageUrl);
    },
    [setValue, getValues]
  );

  const handleRemoveAll = () => {
    setValue("imageFile", []);
    setValue("imageUrls", []);
  };

  const handleRemove = (file: File) => {
    let imageFile: (File | string)[] = getValues("imageFile");
    let imageUrls: (File | string)[] = getValues("imageUrls");

    imageFile = imageFile.filter((_file) => _file !== file);

    imageUrls = imageUrls.filter((_file) => _file !== file);

    setValue("imageFile", imageFile);
    setValue("imageUrls", imageUrls);
  };

  const onSubmit = (data) => {
    if (id && !isClone) {
      dispatch(updateProductDashboard(id, data));
    } else {
      dispatch(createProductDashboard(data));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getProductDashboard(id));
    }
    dispatch(getAllCategories());
  }, [dispatch, id]);

  useEffect(() => {
    reset(defaultValues);
  }, [product, reset]);

  useEffect(() => {
    register("descriptions", { required: true });
  }, [register]);

  return (
    <Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 2 }}
        >
          <TitleStyle>
            <CategoryIcon sx={{ width: "35px", height: "35px" }} />
            <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
              Product
            </Typography>
          </TitleStyle>

          <Box>
            <Button type="submit" variant="outlined" color="primary">
              Save
            </Button>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            width: 1,
            minHeight: "100vh",
            backgroundColor: "white",
          }}
        >
          <Stack flexGrow="1">
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Tabs
                value={currentTab}
                scrollButtons="auto"
                allowScrollButtonsMobile
                onChange={(e, value) => handleChangeTab(value)}
              >
                {PROFILE_TABS.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    icon={tab.icon}
                    iconPosition="end"
                    label={capitalCase(tab.value)}
                  />
                ))}
              </Tabs>
            </Box>
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <Box sx={{ px: 0.5, py: 2 }}>
                {currentTab === "Product" && (
                  <ProductForm
                    categories={categories}
                    product={product}
                    editorContent={editorContent}
                    onEditorStateChange={onEditorStateChange}
                    errors={errors}
                  />
                )}
                {currentTab === "Images" && (
                  <ProductUpLoadImg
                    handleDrop={handleDrop}
                    handleRemoveAll={handleRemoveAll}
                    handleRemove={handleRemove}
                  />
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </FormProvider>
    </Box>
  );
}

export default EditProductPage;
