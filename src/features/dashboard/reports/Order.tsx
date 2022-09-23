import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme
} from "@mui/material";
import { addDays, isSameDay } from "date-fns";
import { Bar } from "react-chartjs-2";
import { getArrayLastDays, setDateMDY } from "../../../utils/formatTime";


interface OrderProps {
  lastestOrders: ;
 rangeDays: 
}


export default function Order(props :OrderProps) {
  const { lastestOrders, rangeDays } = props;
  const theme = useTheme();

  const checkDatesInRange = (date :string) => {
    let result = lastestOrders?.find((order :string) =>
      isSameDay(new Date(+date), setDateMDY(order.day))
    );
    if (!result) return 0;
    return result.count;
  };

  const dataOrders = rangeDays.split(",")?.map((date : string) => {
    return checkDatesInRange(date);
  });

  const data = {
    datasets: [
      {
        backgroundColor: "#f64f53",
        barPercentage: 0.5,
        barThickness: 15,
        borderRadius: 2,
        categoryPercentage: 1,
        data: dataOrders.reverse(),
        label: "number of Orders",
        maxBarThickness: 60,
      },
    ],
    labels: getArrayLastDays(7, true, addDays(new Date(), 1)).reverse(),
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <Card>
      <CardHeader
        action={
          <Button endIcon={<ArrowDropDownIcon fontSize="small" />} size="small">
            Last 7 days
          </Button>
        }
        title="Latest Orders"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: "relative",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
}
