import { Container, Divider, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import CategoriesMenu from "./CategoryMenu";

const StackStyled = styled(Stack)(({ theme }) => ({
  boxShadow: "0px 4px 16px rgb(43 52 69 / 10%)",
  height: 70,
}));

const MenuItemstyled = styled(NavLink)(({ theme }) => ({
  cursor: "pointer",
}));

function CategoryBar() {
  const upMd = useResponsive("up", "md");

  return (
    <StackStyled alignItems="center" direction="row">
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {upMd && <CategoriesMenu />}

          <Stack
            direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <MenuItemstyled to="/">Home</MenuItemstyled>
            <MenuItemstyled to="/category">Category</MenuItemstyled>
            <MenuItemstyled to="/checkout">Checkout</MenuItemstyled>
            <MenuItemstyled to="/order">Order</MenuItemstyled>
          </Stack>
        </Stack>
      </Container>
    </StackStyled>
  );
}

export default CategoryBar;
