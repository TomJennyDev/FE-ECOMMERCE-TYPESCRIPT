import * as React from "react";
import { Route, Routes } from "react-router-dom";
import BlankLayout from "../layouts/BlankLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import CartPage from "../pages/CartPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import EditOrderPage from "../pages/Dashboard/EditOrderPage";
import EditProductPage from "../pages/Dashboard/EditProductPage";
import ProductPage from "../pages/Dashboard/ProductPage";
import UserPage from "../pages/Dashboard/UserPage";
import DetailPage from "../pages/DetailPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import OrderPage from "../pages/OrderPage";
import SearchPage from "../pages/SearchPage";
import UserProfilePage from "../pages/UserProfilePage";
import AuthRequire from "./AuthRequire";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<SearchPage />} />
        <Route
          path="profile"
          element={
            <AuthRequire>
              <UserProfilePage />
            </AuthRequire>
          }
        />
        <Route path="detail/:id" element={<DetailPage />} />
        <Route path="category/:id" element={<SearchPage />} />
        <Route path="category" element={<SearchPage />} />
        <Route
          path="order"
          element={
            <AuthRequire>
              <OrderPage />
            </AuthRequire>
          }
        />

        <Route
          path="checkout"
          element={
            <AuthRequire>
              <CartPage />
            </AuthRequire>
          }
        />
      </Route>
      <Route element={<BlankLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <AuthRequire>
            <DashboardLayout />
          </AuthRequire>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="products/add" element={<EditProductPage />} />
        <Route path="products/clone/:id" element={<EditProductPage />} />
        <Route path="order" element={<EditOrderPage />} />
        <Route path="user" element={<UserPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
