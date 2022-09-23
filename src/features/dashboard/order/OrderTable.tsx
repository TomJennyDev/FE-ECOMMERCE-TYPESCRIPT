import ClearAllIcon from "@mui/icons-material/ClearAll";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
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
import * as React from "react";
import { useEffect } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { FSelect } from "../../../components/form";
import FMultiDatePicker from "../../../components/form/FMultiDatePicker";
import { SeverityPill } from "../../../components/severity-pill";
import TablePaginationActions from "../../../components/TablePaginationActions";
import { addDays, fDate } from "../../../utils/formatTime";
import { fCurrency } from "../../../utils/numberFormat";
import { labelMethodPayment } from "../../cart/CartPayment";
import CartSumTable from "../../cart/CartSumTable";
import {
  getOrdersDashboard,
  getProductOrder,
  handleChangeFilters,
  handleClearFilters,
} from "../../order/orderSlice";

export const STATUS_ORDER = ["pending", "delivered", "refunded", "cancel"];

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
    id: "customer",
    aligns: "right",
    disablePadding: false,
    label: "Customer",
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

const EnhancedTableToolbar = (props) => {
  const dispatch = useDispatch();
  const { numSelected, selected, setPage, reset, watch } = props;
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    const subscription = watch((value) => {
      let { delivery, ...restValue } = value;

      let filters = {};
      const deliveryStart = delivery[0] && delivery[0].toISOString();
      const deliveryEnd = delivery[1] && delivery[1].toISOString();
      filters = { ...restValue, deliveryEnd, deliveryStart };

      dispatch(handleChangeFilters(filters));
    });

    return () => {
      reset();
      dispatch(handleClearFilters());
      subscription.unsubscribe();
    };
  }, [watch, dispatch]);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
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
        direction="row"
        justifyContent="space-between"
        alignItems="center"
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
            direction="row"
            alignItems="center"
            sx={{ flex: "1 1 100%" }}
            spacing={2}
          >
            <FSelect
              name="status"
              label="status"
              size="small"
              sx={{ width: "200px" }}
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
              startText="Delivery-on-start"
              endText="Delivery-on-end"
            />
          </Stack>
        )}
        <Tooltip title="Watch Product">
          <IconButton
            onClick={() => {
              if (numSelected > 0) dispatch(getProductOrder(selected[0]));
            }}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
        {numSelected > 0 ? (
          <FSelect
            name="statusUpdate"
            label="status"
            size="small"
            sx={{ width: "200px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SettingsIcon />
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
        ) : (
          <>
            <Tooltip title="Clear filter">
              <IconButton
                onClick={() => {
                  setPage(0);
                  reset();
                  dispatch(handleClearFilters());
                }}
              >
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </Toolbar>
  );
};

export default function OrderTable({
  reset,
  watch,
  selected,
  setSelected,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}) {
  const { orders, totalOrder, filters, productOrder } = useSelector(
    (state) => state.order
  );
  const dispatch = useDispatch();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");

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
    dispatch(getOrdersDashboard(filters));
  }, [page, rowsPerPage, filters, productOrder]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setSelected={setSelected}
          reset={reset}
          watch={watch}
          setPage={setPage}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
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
                        <Typography variant="subtitle2" noWrap>
                          {row?.userId.name}
                        </Typography>
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
                    height: 53 * emptyRows,
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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
