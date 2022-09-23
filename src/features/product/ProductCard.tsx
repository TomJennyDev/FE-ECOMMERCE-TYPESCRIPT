import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import {
  Box,
  Card,
  IconButton,
  Link,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaAngleDoubleDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Label from "../../components/Label";
import SkeletonLoading from "../../components/SkeletonLoading";
import useAuth from "../../hooks/useAuth";
import { Product } from "../../interface";
import { fCurrency } from "../../utils/numberFormat";
import { updateQuantityProductCart } from "../cart/cartSlice";
import { getProduct, sendReviewReaction } from "./productSlice";

const ProductImgStyle = styled("img")(({ theme }) => ({
  width: "50%",
  height: "auto",
  transform: "translate(-50%,-50%) scale(1)",
  top: "50%",
  left: "50%",
  position: "absolute",
  transition: theme.transitions.create(["transform", "hover"], {
    duration: theme.transitions.duration.standard,
  }),
  "&:hover": {
    transform: "translate(-50%,-50%) scale(1.05)",
  },
}));

const StatusLabel = styled(Label)(({ status }: { status: string }) => ({
  zIndex: 9,
  top: 16,
  right: 16,
  position: "absolute",
  textTransform: "uppercase",
  color: "white",
  boxShadow: 2,
  p: 1,
  background:
    status === "sale"
      ? "linear-gradient(to right, #f12711, #f5af19)"
      : "linear-gradient(to left, #009fff, #ec2f4b)",
}));

const SaleLabel = styled(Label)(({ theme }) => ({
  zIndex: 9,
  top: 16,
  left: 16,
  position: "absolute",
  textTransform: "uppercase",
  color: "white",
  boxShadow: 3,

  fontSize: "1rem",
  background: "linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)",
}));

interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
}

export default function ProductCard({
  product,
  isLoading = false,
}: ProductCardProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    _id,
    title,
    imageUrls,
    price,
    status,
    priceSale,
    rateAverage,
    totalRatings,
    discount,
  } = product;

  const getLabelText = () => {
    return `(${totalRatings})`;
  };
  return (
    <Card sx={{ height: "100%", p: 0, m: 0 }}>
      {isLoading ? (
        <SkeletonLoading
          isLoading={isLoading}
          style={{ width: "100%", pt: "100%" }}
        />
      ) : (
        <Box
          sx={{
            pt: "100%",
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={() => {
            navigate(`/detail/${_id}`);
          }}
        >
          {status && (
            <StatusLabel variant="filled" status={status}>
              {status}
            </StatusLabel>
          )}

          {status === "sale" && (
            <SaleLabel variant="filled">
              {discount + "%"}
              <FaAngleDoubleDown />
            </SaleLabel>
          )}

          <ProductImgStyle alt={title} src={imageUrls[0]} />
        </Box>
      )}

      <Stack spacing={1} sx={{ p: 2 }}>
        {isLoading ? (
          <SkeletonLoading isLoading={isLoading} count={3} width="100%" />
        ) : (
          <>
            <Link
              to={`/detail/${_id}`}
              color="inherit"
              component={RouterLink}
              onClick={() => dispatch(getProduct(_id))}
            >
              <Typography variant="subtitle2" noWrap>
                <SkeletonLoading isLoading={isLoading} height="100%">
                  {title}
                </SkeletonLoading>
              </Typography>
            </Link>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating
                name="read-only"
                value={rateAverage}
                precision={1}
                onChange={(event, newValue) => {
                  if (!isAuthenticated) {
                    toast.error(`Please login for rating!`);
                  } else if (newValue) {
                    dispatch(
                      sendReviewReaction({ productId: _id, rate: +newValue })
                    );
                  }
                }}
                getLabelText={getLabelText}
                size="small"
              />

              <Typography variant="subtitle2" noWrap color="text.disabled">
                ({totalRatings})
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle1">
                <Typography
                  component="span"
                  variant="body1"
                  sx={{
                    color: "text.disabled",
                    textDecoration: "line-through",
                  }}
                >
                  {price && fCurrency(price)}
                </Typography>
                &nbsp;
                {fCurrency(priceSale)}
              </Typography>

              <IconButton
                aria-label="delete"
                size="medium"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error(`Please login for add to Cart!`);
                  } else {
                    dispatch(
                      updateQuantityProductCart({
                        productId: _id,
                        action: true,
                      })
                    );
                  }
                }}
              >
                <ShoppingCartCheckoutIcon fontSize="inherit" />
              </IconButton>
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
}
