import DeleteIcon from "@mui/icons-material/Delete";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { TitleStyle } from "../../theme/customizations/TitleStyle";
import { removeProductCart, setActiveStep } from "./cartSlice";

interface CartTableToolbarProps {
  numSelected: number;
  selected: any[];
  setSelected: Dispatch<SetStateAction<any[]>>;
}

export default function CartTableToolbar({
  numSelected,
  setSelected,
  selected,
}: CartTableToolbarProps) {
  const dispatch = useAppDispatch();
  const { activeStep, isLoading } = useAppSelector((state) => state.cart);

  return (
    <>
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction="row" alignItems="center" sx={{ flex: "1 1 100%" }}>
          <TitleStyle>
            <LocalMallIcon sx={{ width: "35px", height: "35px" }} />
            <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
              Cart
            </Typography>
          </TitleStyle>
        </Stack>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <LoadingButton
            loading={isLoading}
            onClick={() => {
              dispatch(
                removeProductCart({
                  productId: selected,
                })
              );
              setSelected([]);
            }}
          >
            <DeleteIcon />
          </LoadingButton>
        </Tooltip>
      ) : (
        <Button
          variant="contained"
          onClick={() => {
            dispatch(setActiveStep(activeStep + 1));
          }}
          startIcon={<LocalShippingIcon />}
        >
          Delivery
        </Button>
      )}
    </>
  );
}
