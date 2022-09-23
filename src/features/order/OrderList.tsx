import CancelIcon from "@mui/icons-material/Cancel";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import { InputAdornment, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { FormProvider, FSelect } from "../../components/form";
import FMultiDatePicker from "../../components/form/FMultiDatePicker";
import { SeverityPill } from "../../components/severity-pill";
import TablePaginationActions from "../../components/TablePaginationActions";
import useResponsive from "../../hooks/useResponsive";
import { addDays, fDate } from "../../utils/formatTime";
import { fCurrency } from "../../utils/numberFormat";
import { labelMethodPayment } from "../cart/CartPayment";
import CartSumTable from "../cart/CartSumTable";
import { STATUS_ORDER } from "../dashboard/order/OrderTable";
import {
  getOrderList,
  getProductOrder,
  handleChangeFilters,
  handleClearFilters,
  updateStatusOrderById,
} from "./orderSlice";

const headCells = [
  {
    id: "_id",
    aligns: "left",
    disablePadding: true,
    label: "Order Number",
  },

  {
    id: "status",
    aligns: "right",
    disablePadding: false,
    label: "Status",
  },
  {
    id: "createdAt",
    aligns: "right",
    disablePadding: false,
    label: "Place on",
  },
  {
    id: "DeliveredAt",
    aligns: "right",
    disablePadding: false,
    label: "Delivery on",
  },
  {
    id: "payment",
    aligns: "right",
    disablePadding: false,
    label: "Payment Method",
  },
  {
    id: "total",
    aligns: "right",
    disablePadding: false,
    label: "Total",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.aligns}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const defaultValues = {
  status: "",
  delivery: [null, null],
};

const EnhancedTableToolbar = (props) => {
  const dispatch = useDispatch();
  const mdUp = useResponsive("up", "md");
  const { numSelected, selected, setSelected, setPage, page, rowsPerPage } =
    props;
  const { orders } = useAppSelector((state) => state.order);

  const isPending = orders.find(
    (order) => order._id === selected[0] && order.status === "pending"
  );

  const methods = useForm({ defaultValues, mode: "onChange" });

  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    const subscription = watch((value) => {
      let { delivery, ...restValue } = value;

      let filters = {};
      const deliveryStart = fDate(delivery[0]);
      const deliveryEnd = fDate(delivery[1]);

      filters = { ...restValue, deliveryEnd, deliveryStart };

      dispatch(handleChangeFilters(filters));
    });

    return () => {
      reset(defaultValues);
      dispatch(handleClearFilters());
      subscription.unsubscribe();
    };
  }, [watch, dispatch, reset]);

  const onSubmit = (data) => null;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          pt: 2,
          width: "100%",
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        <Stack
          sx={{ width: "100%" }}
          direction={mdUp ? "row" : "column"}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
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
            <Stack
              direction={mdUp ? "row" : "column"}
              alignItems="center"
              sx={{
                flex: "1 1 100%",
              }}
              spacing={2}
            >
              <FSelect
                name="status"
                label="status"
                size="small"
                sx={{ width: "250px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {STATUS_ORDER.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </FSelect>
              <FMultiDatePicker
                size="small"
                name="delivery"
                startText="Place-on-start"
                endText="Place-on-end"
              />
            </Stack>
          )}
          <Stack direction="row">
            <Tooltip title="Watch Product">
              <IconButton
                onClick={() => {
                  if (numSelected > 0) {
                    dispatch(getProductOrder(selected[0]));
                  }
                }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
            {numSelected > 0 && isPending ? (
              <Tooltip title="Cancel Order">
                <IconButton
                  onClick={() => {
                    const filters = { page: page + 1, limit: rowsPerPage };
                    dispatch(
                      updateStatusOrderById(
                        {
                          orderId: selected[0],
                          status: "cancel",
                        },
                        filters
                      )
                    );

                    setSelected([]);
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="Clear filter">
                  <IconButton
                    onClick={() => {
                      setPage(0);
                      reset(defaultValues);
                      dispatch(handleClearFilters());
                    }}
                  >
                    <ClearAllIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </FormProvider>
  );
};

export default function OrderList() {
  const { orders, totalOrder, filters, productOrder } = useAppSelector(
    (state) => state.order
  );

  const dispatch = useAppDispatch();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("price");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n._id);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (title) => selected.indexOf(title) !== -1;

  // Avoid a layout jump when reaching the last page with empty products.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalOrder) : 0;

  useEffect(() => {
    const filters = { page: page + 1, limit: rowsPerPage };
    dispatch(getOrderList(filters));
  }, [dispatch, page, rowsPerPage, filters, productOrder]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setSelected={setSelected}
          setPage={setPage}
          page={page}
          rowsPerPage={rowsPerPage}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={orders?.length}
            />
            <TableBody>
              {stableSort(orders, getComparator(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => {
                        handleClick(event, row._id);
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        sx={{ p: 1 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="initial"
                            sx={{ display: "inline-block", width: "70%" }}
                          >
                            {row?._id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <SeverityPill
                          color={
                            (row?.status === "delivered" && "success") ||
                            (row?.status === "pending" && "info") ||
                            (row?.status === "refunded" && "error") ||
                            "warning"
                          }
                        >
                          {row?.status}
                        </SeverityPill>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="subtitle2"
                          noWrap
                          color="text.disabled"
                        >
                          {row?.createdAt && fDate(row?.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" color="initial">
                          {row?.createdAt &&
                            row.shipping?.method &&
                            addDays(row?.createdAt, +row.shipping?.method)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="flex-end"
                          spacing={1}
                        >
                          <Typography variant="subtitle1" color="initial">
                            {labelMethodPayment[row?.payment?.method]}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" color="initial">
                          {fCurrency(row?.payment?.total.total)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalOrder}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
      <CartSumTable products={productOrder} />
    </Box>
  );
}
