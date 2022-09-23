import { Box, Container, Grid } from "@mui/material";
import { addDays } from "date-fns";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReportsDashboard } from "../../features/dashboard/dashboardSlice";
import LatestOrders from "../../features/dashboard/reports/latest-orders";
import LatestProducts from "../../features/dashboard/reports/latest-products";
import Order from "../../features/dashboard/reports/Order";
import { Revenue } from "../../features/dashboard/reports/Revenue";
import TotalCustomers from "../../features/dashboard/reports/TotalCustomers";
import TotalOrder from "../../features/dashboard/reports/TotalOrder";
import TotalProducts from "../../features/dashboard/reports/TotalProducts";
import { getArrayLastDays } from "../../utils/formatTime";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { reports } = useSelector((state) => state.dashboard);

  const rangeDays = getArrayLastDays(7, false, addDays(new Date(), 1)).join(
    ","
  );
  useEffect(() => {
    const filters = { rangeDays };
    const intervalId = setInterval(() => {
      dispatch(getReportsDashboard(filters));
    }, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    const filters = { rangeDays };
    dispatch(getReportsDashboard(filters));
  }, []);

  return (
    <Box>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Revenue revenues={reports.revenue} />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalCustomers totalCustomers={reports.totalCustomer} />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalOrder totalOrders={reports.totalOrder} />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalProducts
              totalProducts={reports.totalProduct}
              sx={{ height: "100%" }}
            />
          </Grid>
          <Grid item xl={12} lg={12} md={12} xs={12}>
            <Order
              lastestOrders={reports.lastestOrders}
              rangeDays={rangeDays}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={12} xs={12}>
            <LatestProducts sx={{ height: "100%" }} />
          </Grid>
          <Grid item xl={8} lg={8} md={12} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
