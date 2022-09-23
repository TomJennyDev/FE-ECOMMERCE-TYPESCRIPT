import AddCircleIcon from "@mui/icons-material/AddCircle";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DifferenceIcon from "@mui/icons-material/Difference";
import { Chip, Rating, Stack } from "@mui/material";
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
import { Link, NavLink } from "react-router-dom";
import SearchInput from "../../../components/SearchInput";
import TablePaginationActions from "../../../components/TablePaginationActions";
import { fCurrency, fNumber } from "../../../utils/numberFormat";
import { getComparator, stableSort } from "../../../utils/sort";
import ProductSort from "../../product/ProductSort";
import {
  getAllProductsDashboard,
  handleChangeDashBoardFilters,
  handleClearDashBoardFilters,
} from "../dashboardSlice";

const headCells = [
  {
    id: "_id",
    aligns: "left",
    disablePadding: true,
    label: "Product",
  },
  {
    id: "category",
    aligns: "left",
    disablePadding: false,
    label: "Category",
  },
  {
    id: "rating",
    aligns: "center",
    disablePadding: false,
    label: "Rating",
  },
  {
    id: "price",
    aligns: "right",
    disablePadding: false,
    label: "Price",
  },
  {
    id: "quantity",
    aligns: "right",
    disablePadding: false,
    label: "Quantity",
  },
  {
    id: "status",
    aligns: "right",
    disablePadding: false,
    label: "Status",
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
  const { numSelected, selected, setSelected, setPage } = props;
  const handleSubmit = (searchQuery) =>
    dispatch(handleChangeDashBoardFilters({ title: searchQuery }));
  const handleDispatch = (value) =>
    dispatch(handleChangeDashBoardFilters(value));
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
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
          <SearchInput handleSubmit={handleSubmit} />
          <ProductSort handleDispatch={handleDispatch} />
        </Stack>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Clone Product">
          <IconButton
            component={NavLink}
            to={`/dashboard/products/clone/${selected[0]}`}
            onClick={() => setSelected([])}
          >
            <DifferenceIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Product">
          <IconButton
            component={NavLink}
            to={`/dashboard/products/add`}
            onClick={() => setSelected([])}
          >
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Edit Product">
          <IconButton
            component={NavLink}
            to={`/dashboard/products/edit/${selected[0]}`}
            onClick={() => setSelected([])}
          >
            <AutoFixHighIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Clear filter">
          <IconButton
            onClick={() => {
              setPage(0);
              dispatch(handleClearDashBoardFilters());
            }}
          >
            <ClearAllIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default function ProductTable() {
  const { products, totalProduct, filters } = useSelector(
    (state) => state.dashboard
  );
  const dispatch = useDispatch();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((n) => n._id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalProduct) : 0;

  useEffect(() => {
    const filters = { page: page + 1, limit: rowsPerPage };
    dispatch(getAllProductsDashboard(filters));
  }, [page, rowsPerPage, filters, dispatch]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setSelected={setSelected}
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
              rowCount={products?.length}
            />
            <TableBody>
              {stableSort(products, getComparator(order, orderBy)).map(
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
                        width="500px"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: "400px",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100px",
                              height: "100px",
                              display: "inline-block",
                              mr: 2,
                            }}
                          >
                            <img
                              src={row?.imageUrls?.[0]}
                              alt={row?.title}
                              style={{ width: "100%", height: "100%" }}
                            />
                          </Box>
                          <Typography
                            component={Link}
                            to={`/detail/${row?._id}`}
                            variant="subtitle2"
                            color="initial"
                            sx={{ display: "inline-block", width: "70%" }}
                          >
                            {row?.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle1" color="initial">
                          {row?.categoryId?.title}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" alignItems="center">
                          <Rating
                            name="rating"
                            value={row?.rateAverage}
                            precision={1}
                            getLabelText={() => `${row?.totalRatings}`}
                            size="small"
                          />
                          <Typography
                            variant="subtitle2"
                            noWrap
                            color="text.disabled"
                          >
                            ({row?.totalRatings})
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="subtitle1"
                          color="initial"
                          sx={{
                            color: "text.disabled",
                            textDecoration: "line-through",
                          }}
                        >
                          {fCurrency(row?.price)}
                        </Typography>
                        <Typography variant="subtitle1" color="initial">
                          {fCurrency(row?.priceSale)}
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
                            {fNumber(row?.quantity)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" color="initial">
                          <Chip
                            label={row?.isDeleted ? "Deactive" : "Active"}
                            color={row?.isDeleted ? "error" : "info"}
                          />
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
          count={totalProduct}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    </Box>
  );
}
