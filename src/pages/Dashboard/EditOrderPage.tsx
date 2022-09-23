import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { FormProvider } from "../../components/form";
import Iconify from "../../components/Iconify";
import OrderTable from "../../features/dashboard/order/OrderTable";
import { updateOrderDashboard } from "../../features/order/orderSlice";
import { TitleStyle } from "../../theme/customizations/TitleStyle";

const defaultValues = {
  status: "",
  statusUpdate: "pending",
  delivery: [null, null],
};

export default function EditOrderPage() {
  const dispatch = useDispatch();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const methods = useForm({ defaultValues, mode: "onChange" });

  const { handleSubmit, reset, watch } = methods;
  const onSubmit = (data) => {
    const filters = { page: page + 1, limit: rowsPerPage };
    dispatch(
      updateOrderDashboard(
        {
          orderIds: selected,
          status: data.statusUpdate,
        },
        filters
      )
    );
    setSelected([]);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2 }}
      >
        <TitleStyle>
          <Iconify
            icon={"icon-park-solid:transaction-order"}
            width={35}
            height={35}
          />
          <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
            ORDER
          </Typography>
        </TitleStyle>
        <Box>
          <Button type="submit" variant="outlined" color="primary">
            Save
          </Button>
        </Box>
      </Stack>

      <Box>
        <OrderTable
          reset={reset}
          watch={watch}
          selected={selected}
          setSelected={setSelected}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Box>
    </FormProvider>
  );
}
