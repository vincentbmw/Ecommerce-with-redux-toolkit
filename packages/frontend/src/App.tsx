import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { refreshAuthentication } from "./features/slices/authSlice";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Footer from "./components/Footer";
import ShopPage from "./pages/main/ShopPage";
import AdminPage from "./pages/main/AdminPage";
import SellerPage from "./pages/main/SellerPage";
import type { RootState } from "./store";
import NotFound from "./pages/404";

const App = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(refreshAuthentication());
  }, [dispatch]);

  const ProtectedRoute = ({ element, allowedRole }: { element: JSX.Element, allowedRole: string }) => {
    if (!authState.user || authState.user.role !== allowedRole) {
      return <Navigate to="/404" replace />;
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ShopPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<AdminPage />} allowedRole="admin" />
          }
        />
        <Route
          path="/seller"
          element={
            <ProtectedRoute element={<SellerPage />} allowedRole="seller" />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
