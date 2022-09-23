import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { SeverityPill } from "../../../components/severity-pill";
import { fDate } from "../../../utils/formatTime";
import { fCurrency } from "../../../utils/numberFormat";
import { getOrdersDashboard } from "../dashboardSlice";

export default function LatestOrders(props) {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const filter = { sortBy: "createdAt.desc" };
    dispatch(getOrdersDashboard(filter));
  }, []);

  useEffect(() => {
    const filter = { sortBy: "createdAt.desc" };

    const intervalId = setInterval(() => {
      dispatch(getOrdersDashboard(filter));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <Card>
      <CardHeader title="Latest Orders" />
      <PerfectScrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order Ref</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow hover key={order?._id}>
                <TableCell>{order?._id}</TableCell>
                <TableCell>{order?.userId?.name}</TableCell>
                <TableCell>
                  {order.createdAt && fDate(order.createdAt, "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {order.payment && fCurrency(order.payment.total.total)}
                </TableCell>
                <TableCell>
                  <SeverityPill
                    color={
                      (order?.status === "delivered" && "success") ||
                      (order?.status === "pending" && "info") ||
                      (order?.status === "refunded" && "error") ||
                      "warning"
                    }
                  >
                    {order?.status}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PerfectScrollbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button
          color="primary"
          component={Link}
          to={`/dashboard/order`}
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}
