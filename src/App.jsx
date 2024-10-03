import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./components/Login/Signup";
import Login from "./components/Login/Login";
import Headers from "./components/Header/Header";
import Home from "./pages/HomePage";
import CartDetails from "./components/Cart/CartDetail";
import { checkAuth, fetchUser } from "./Redux/Slices/UserSlices/UserSlice";
import "./App.css";
import ProductPage from "./pages/ProductPages";
import Success from "./pages/Success";
function App() {
  const dispatch = useDispatch();

  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(checkAuth());
    if (isAuthenticated && !userInfo) {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, userInfo, dispatch]);
  return (
    <Router>
      <Headers />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/Cart" element={<CartDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/success" element={<Success />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
