// material
import { Alert, Grid } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductSkeleton";
import { getAllProducts } from "./productSlice";

export default function ProductList() {
  const dispatch = useDispatch();
  let { products, filters, isLoading } = useSelector((state) => state.product);
  products = isLoading ? Array.from(Array(9).keys()) : products;

  useEffect(() => {
    dispatch(getAllProducts());
  }, [filters, dispatch]);

  return (
    <Grid container spacing={3}>
      {products.length === 0 && (
        <Alert
          severity="info"
          sx={{
            width: "100%",
            textAlign: "center",
            m: 4,
            mt: 6,
            backgroundColor: "white",
          }}
        >{`No results found`}</Alert>
      )}

      {products.map((product, idx) => (
        <Grid key={product._id || idx} item xs={12} sm={6} md={4}>
          {isLoading ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard product={product} isLoading={isLoading} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
