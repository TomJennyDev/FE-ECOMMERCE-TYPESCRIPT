import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { fToNow } from "../../../utils/formatTime";
import { getAllProductsDashboard } from "../dashboardSlice";

export default function LatestProducts(props) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const filter = { sortBy: "createdAt.desc" };
    dispatch(getAllProductsDashboard(filter));
  }, [dispatch]);

  return (
    <Card {...props}>
      <CardHeader
        subtitle={`${products?.length} in total`}
        title="Latest Products"
      />
      <Divider />
      <List>
        {products?.map((product, i) => (
          <ListItem divider={i < products.length - 1} key={product?._id}>
            <ListItemAvatar>
              <img
                alt={product?.title}
                src={product.imageUrls[0]}
                style={{
                  height: 48,
                  width: 48,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={product.name}
              secondary={`Updated ${fToNow(product?.updatedAt)}`}
            />
            <IconButton
              edge="end"
              size="small"
              component={Link}
              to={`/detail/${product?._id}`}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
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
          component={Link}
          to={`/dashboard/products`}
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}
