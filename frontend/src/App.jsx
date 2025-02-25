import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./app/auth/login/page";
import AuthRegister from "./app/auth/register/page";
import AdminLayout from "./components/admin-view/layout";
import AdminOrders from "./app/admin-view/orders/page";
import AdminFeatures from "./app/admin-view/features/page";
import AdminProducts from "./app/admin-view/products/page";
import Admindashboard from "./app/admin-view/dashboard/page";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./app/not-fount/page";
import Home from "./app/shopping-view/home/page";
import Listings from "./app/shopping-view/listings/page";
import Account from "./app/shopping-view/account/page";
import CheckOut from "./app/shopping-view/check-out/page";
import CheckAuth from "./components/common/check-auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import PaypalReturnPage from "./app/shopping-view/paypal-return/page";
import PayemntSuccess from "./app/shopping-view/payment-success/page";
import PaypalCancel from "./app/shopping-view/paypal-cancel/page";
import SaerchPage from "./app/shopping-view/search/page";
import Wishlist from "./components/shopping-view/wishlist";

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex flex-col bg-white w-full h-full">
      <Routes>
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="dashboard" element={<Admindashboard />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="listing" element={<Listings />} />
          <Route path="account" element={<Account />} />
          <Route path="check-out" element={<CheckOut />} />
          <Route path="search" element={<SaerchPage />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

          <Route path="/shop/paypal-return" element={<PaypalReturnPage />} />
          <Route path="/shop/payment-success" element={<PayemntSuccess />} />
          <Route path="/shop/payment-success" element={<PaypalCancel />} />

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
