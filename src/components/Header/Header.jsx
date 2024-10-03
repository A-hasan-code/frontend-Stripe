// src/components/Headers.js
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink, useNavigate } from "react-router-dom";
import { BsBag, BsHeart, BsPerson } from "react-icons/bs";
import logo from "../../assets/logo/avfzzgn3a.webp";
import { addToCart } from "../../Redux/Slices/cartSlices";
import { logoutUser } from "../../Redux/Slices/UserSlices/UserSlice";
import "./Header.css";
import "react-toastify/dist/ReactToastify.css";

const Headers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.wishlist || []);
  const cartItems = useSelector((state) => state.cart.carts || []);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success("Product added to cart successfully!");
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setShowProfileOptions((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // unwrap to catch errors
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <Navbar expand="lg" className="navbar-custom">
        <Container className="d-flex justify-content-between align-items-center">
          <NavLink
            to="/"
            className="text-decoration-none text-light d-flex align-items-center"
          >
            <img src={logo} alt="Logo" className="logo" />
            <h3 className="text-light ms-2">Stripe_Store</h3>
          </NavLink>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto nav-links">
              <NavLink to="/" className="nav-link mx-3">
                Home
              </NavLink>
              <NavLink to="/product" className="nav-link mx-3">
                Products
              </NavLink>
              <NavLink to="/about" className="nav-link mx-3">
                About
              </NavLink>
              <NavLink to="/contact" className="nav-link mx-3">
                Contact
              </NavLink>
            </Nav>

            <div className="d-flex align-items-center nav-icons">
              <NavLink
                to="/wishlist"
                className="text-decoration-none text-light mx-2"
              >
                <BsHeart size={24} />
                {wishlist.length > 0 && (
                  <span className="badge">{wishlist.length}</span>
                )}
              </NavLink>

              <div
                className="text-decoration-none text-light mx-2"
                onClick={handleUserClick}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <BsPerson size={24} />
                {isAuthenticated && showProfileOptions && (
                  <div className="profile-options">
                    <button onClick={() => navigate("/profile")}>
                      Profile
                    </button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>

              <NavLink
                to="/cart"
                className="text-decoration-none text-light mx-2"
              >
                <BsBag size={24} />
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}
              </NavLink>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Headers;
