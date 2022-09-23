import CategoryIcon from "@mui/icons-material/Category";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import ProductTable from "../../features/dashboard/Product/ProductTable";
import { TitleStyle } from "../../theme/customizations/TitleStyle";

function ProductPage(props) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" sx={{ py: 2 }}>
        <TitleStyle>
          <CategoryIcon sx={{ width: "35px", height: "35px" }} />
          <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
            Product
          </Typography>
        </TitleStyle>
      </Stack>
      <ProductTable />
    </Box>
  );
}

export default ProductPage;
