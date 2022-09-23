import LocalMallIcon from "@mui/icons-material/LocalMall";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  AppBar,
  Avatar,
  Badge,
  Divider,
  Stack,
  useScrollTrigger,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { MouseEvent, useState } from "react";
import {
  Link,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hook";
import Iconify from "../components/Iconify";
import Logo from "../components/Logo";
import SearchHeader from "../components/SearchHeader";
import { handleChangeFilters } from "../features/product/productSlice";
import useAuth from "../hooks/useAuth";
import useResponsive from "../hooks/useResponsive";
import logoImg2 from "../logo2.png";

const styledAppbar = (isScroll: boolean, isDashboard: boolean) => ({
  left: {
    lg: isDashboard ? 280 : 0,
  },
  width: {
    lg: isDashboard ? "calc(100% - 280px)" : "100%",
  },
  backgroundImage: "none",
  backgroundColor: !isDashboard || isScroll ? "palette.background" : "#F2F5F9",
  boxShadow: {
    sx: 5,
    md: isScroll ? 3 : "none",
  },
});

interface MainHeaderProps {
  onOpenSidebar?: VoidFunction;
}

function MainHeader({ onOpenSidebar }: MainHeaderProps) {
  const dispatch = useAppDispatch();
  const { user, logout, isAuthenticated } = useAuth();

  const { totalProduct } = useAppSelector((state) => state.cart);

  const navigate = useNavigate();

  const mdDown = useResponsive("down", "md");
  const mdUp = useResponsive("up", "md");

  const { pathname } = useLocation();

  const isDashboard = pathname.includes("dashboard");

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleDispatch = (searchQuery: string) =>
    dispatch(handleChangeFilters({ title: searchQuery }));

  const handleProfileMenuOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenCart = () => {
    navigate("/checkout");
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      await logout(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error(error);
    }
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant="subtitle2" noWrap>
          {user?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          {user?.email}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Box>
        <MenuItem
          onClick={handleMenuClose}
          to="/profile"
          component={RouterLink}
          sx={{ mx: 1 }}
        >
          My Profile
        </MenuItem>
      </Box>

      {user?.role === "admin" && (
        <MenuItem
          onClick={handleMenuClose}
          to="/dashboard"
          component={RouterLink}
          sx={{ mx: 1 }}
        >
          Dashboard
        </MenuItem>
      )}
      <Divider sx={{ borderStyle: "dashed" }} />

      <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
        Logout
      </MenuItem>
    </Menu>
  );

  const isScroll = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  return (
    <Box>
      <AppBar
        position="fixed"
        color="inherit"
        sx={(theme) => styledAppbar(isScroll, isDashboard)}
      >
        <Box maxWidth="lg" sx={{ px: 0, mx: "auto", width: 1 }}>
          <Toolbar>
            <Stack
              alignItems="center"
              justifyContent="space-between"
              direction="row"
              sx={{ flexGrow: 1 }}
            >
              {isDashboard ? (
                <IconButton
                  onClick={onOpenSidebar}
                  sx={{ mr: 1, color: "text.primary", display: { lg: "none" } }}
                >
                  <Iconify icon="ri:menu-2-fill" />
                </IconButton>
              ) : (
                <>
                  {mdDown && (
                    <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="open drawer"
                      sx={{ mr: 2 }}
                    >
                      <Logo />
                    </IconButton>
                  )}
                  {mdUp && (
                    <Box sx={{ width: 280, m: 0, p: 0, height: "100%" }}>
                      <Link to="/">
                        <img
                          src={logoImg2}
                          alt="logo"
                          width="100%"
                          height="100%"
                        />
                      </Link>
                    </Box>
                  )}
                </>
              )}

              {isScroll && !isDashboard && mdUp && (
                <SearchHeader handleDispatch={handleDispatch} />
              )}

              <Stack
                direction="row"
                spacing={3}
                justifyContent="flex-end"
                sx={{ width: "280px", flexGrow: isDashboard && 1 }}
              >
                {!isAuthenticated ? (
                  <Avatar
                    onClick={() => navigate("/login")}
                    alt="Cart"
                    sx={{
                      width: 32,
                      height: 32,
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "primary.main" },
                    }}
                  >
                    <LockOpenIcon />
                  </Avatar>
                ) : (
                  <>
                    <Badge badgeContent={totalProduct} color="primary">
                      <Avatar
                        onClick={handleOpenCart}
                        alt="Cart"
                        sx={{ width: 32, height: 32, cursor: "pointer" }}
                      >
                        <LocalMallIcon />
                      </Avatar>
                    </Badge>
                    <Avatar
                      onClick={handleProfileMenuOpen}
                      src={user?.avatarUrl as string}
                      alt={user?.name}
                      sx={{ width: 32, height: 32, cursor: "pointer" }}
                    />
                  </>
                )}
              </Stack>
            </Stack>
          </Toolbar>
        </Box>
      </AppBar>
      {renderMenu}
    </Box>
  );
}

export default MainHeader;
