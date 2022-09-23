import CameraIcon from "@mui/icons-material/Camera";
import DevicesIcon from "@mui/icons-material/Devices";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import LaptopIcon from "@mui/icons-material/Laptop";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PrintIcon from "@mui/icons-material/Print";
import WatchIcon from "@mui/icons-material/Watch";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { FormProvider } from "../../components/form";
import FRating from "../../components/form/FRating";
import FSlider from "../../components/form/FSlider";
import Iconify from "../../components/Iconify";
import { handleChangeFilters, handleClearFilters } from "./productSlice";

export const SORT_BY_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_desc", label: "Price: High-Low" },
  { value: "price_asc", label: "Price: Low-High" },
];

const arrIcon = [
  <DevicesIcon />,
  <LaptopIcon />,
  <CameraIcon />,
  <HeadphonesIcon />,
  <PrintIcon />,
  <WatchIcon />,
  <PhoneIphoneIcon />,
];

export const FILTER_RATING_OPTIONS = [4, 3, 2, 1];

export const FILTER_PRICE_OPTIONS = [
  { value: 0, label: "0" },
  { value: 500, label: "0 - 500" },
  { value: 1000, label: "1000" },
];

const defaultValues = {
  price: [0, 1000000],
  rating: 1,
};

interface ProductSidebarProps {
  onCloseFilter : , 
  isOpenFilter:
}  

function ProductSidebar({ onCloseFilter, isOpenFilter }: ProductSidebarProps) {
  const dispatch = useAppDispatch();

  const { categories } = useAppSelector((state) => state.category);

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const methods = useForm({ defaultValues, mode: "onChange" });
  const { handleSubmit, reset, watch } = methods;

  const onSubmit = (data) => {};

  useEffect(() => {
    const subscription = watch((value) => {
      dispatch(
        handleChangeFilters({
          rating: value.rating,
          sortBy: "rateAverage.asc",
          price_min: value?.price[0],
          price_max: value?.price[1],
        })
      );
    });

    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  return (
    <Paper>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {isOpenFilter && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1, py: 2 }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                Filters
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Iconify icon="eva:close-fill" width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />
          </>
        )}

        <Stack spacing={3} sx={{ p: 2 }}>
          <div>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <WidgetsIcon />
                </ListItemIcon>
                <ListItemText primary="Categories" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                {categories?.map((cate, idx) => {
                  return (
                    <List component="div" disablePadding key={cate._id}>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() =>
                          dispatch(
                            handleChangeFilters({ categoryId: cate._id })
                          )
                        }
                      >
                        <ListItemIcon>{arrIcon[idx]}</ListItemIcon>
                        <ListItemText primary={cate.title} />
                      </ListItemButton>
                    </List>
                  );
                })}
              </Collapse>
            </List>
          </div>

          <Divider />
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Price
            </Typography>
            <FSlider name="price" step={10} max={1000} />
          </div>

          <Divider />

          <div>
            <Typography variant="subtitle1" gutterBottom>
              Rating
            </Typography>

            <FRating name="rating" options={FILTER_RATING_OPTIONS} />
          </div>
        </Stack>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={() => {
              reset();
              dispatch(handleClearFilters());
            }}
          >
            Clear All
          </Button>
        </Box>
      </FormProvider>
    </Paper>
  );
}

export default ProductSidebar;
