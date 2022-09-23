import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button, Stack, TableContainer } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { ChangeEvent, MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import EnhancedTableHead from "../../components/table/EnhancedTableHead";
import EnhancedTableToolbar from "../../components/table/EnhancedTableToolbar";
import { HeadCells, OrderTable, Product } from "../../interface";
import { fCurrency, fNumber } from "../../utils/numberFormat";
import { getComparator, stableSort } from "../../utils/sort";
import CartSideBar from "./CartSideBar";
import { updateQuantityProductCart } from "./cartSlice";
import CartTableToolbar from "./CartTableToolbar";

const ButtonStyled = styled(Button)(({ theme }) => ({
  borderRadius: "50%",
  border: "1px solid",
  width: 30,
  minWidth: 30,
  height: 30,
  zIndex: 999,
}));

export interface HeadCellsCart extends Product {
  quantity: number;
  total: number;
}

const headCells: HeadCells<HeadCellsCart>[] = [
  {
    id: "_id",
    numeric: false,
    disablePadding: true,
    label: "Product",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price ($)",
  },
  {
    id: "priceSale",
    numeric: true,
    disablePadding: false,
    label: "Price Sale ($)",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity (pcs)",
  },
  {
    id: "total",
    numeric: true,
    disablePadding: false,
    label: "Total ($)",
  },
];

export default function CartDetail() {
  const { products, isLoading, activeStep } = useAppSelector(
    (state) => state.cart
  );
  const dispatch = useAppDispatch();

  const [order, setOrder] = useState<OrderTable>("asc");
  const [orderBy, setOrderBy] = useState<keyof HeadCellsCart>(headCells[0].id);
  const [selected, setSelected] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleClick = (event: MouseEvent<unknown>, _id: string) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected: any[] = [];

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

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof HeadCellsCart
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = products.map((n) => n.productId._id);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (title: string) => selected.indexOf(title) !== -1;

  // Avoid a layout jump when reaching the last page with empty products.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  return (
    <Stack sx={{ width: "100%" }} spacing={1}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length}>
          <CartTableToolbar
            numSelected={selected.length}
            selected={selected}
            setSelected={setSelected}
          />
        </EnhancedTableToolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead<HeadCellsCart>
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={products?.length}
              headCells={headCells}
            />
            <TableBody>
              {products &&
                stableSort(products, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.productId._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => {
                          handleClick(event, row.productId._id);
                        }}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.productId._id}
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
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Box sx={{ maxWidth: "100px", height: "100%" }}>
                              <img
                                src={row?.productId?.imageUrls?.[0]}
                                alt={row?.productId?.title}
                                style={{ width: "100%", height: "100%" }}
                              />
                            </Box>
                            <Typography
                              component={Link}
                              to={`/detail/${row.productId._id}`}
                              variant="subtitle2"
                              color="initial"
                            >
                              {row.productId.title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" color="initial">
                            {fCurrency(row.productId.price)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" color="initial">
                            {fCurrency(row.productId.priceSale)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            spacing={1}
                          >
                            <ButtonStyled
                              onClick={(event) => {
                                event.stopPropagation();

                                dispatch(
                                  updateQuantityProductCart({
                                    productId: row.productId._id,
                                    action: false,
                                  })
                                );
                              }}
                              disabled={row.quantity === 1}
                            >
                              <ArrowDownwardIcon />
                            </ButtonStyled>
                            <Typography variant="subtitle1" color="initial">
                              {fNumber(row.quantity)}
                            </Typography>
                            <ButtonStyled
                              onClick={(event) => {
                                event.stopPropagation();
                                dispatch(
                                  updateQuantityProductCart({
                                    productId: row.productId._id,
                                    action: true,
                                  })
                                );
                              }}
                            >
                              <ArrowUpwardIcon />
                            </ButtonStyled>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          {fCurrency(row.quantity * row.productId.priceSale)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Stack alignItems="flex-end">
        <Box sx={{ width: "350px" }}>
          <CartSideBar />
        </Box>
      </Stack>
    </Stack>
  );
}
