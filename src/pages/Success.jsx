import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emptyCart } from "../Redux/Slices/cartSlices"; // Adjust the path as necessary
import toast from "react-hot-toast";

const Success = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Show success message
    toast.success("Payment successful!");

    // Clear cart in Redux state
    dispatch(emptyCart());

    // Clear cart in localStorage
    localStorage.removeItem("cart");

    // Optionally redirect the user after a short delay
    setTimeout(() => {
      navigate("/"); // Redirect to home or another page after success
    }, 3000); // Delay for 3 seconds
  }, [dispatch, navigate]);

  return (
    <div className="success-container">
      <h2>Thank you for your purchase!</h2>
      <p>Your payment was successful.</p>
      <p>Redirecting to the homepage...</p>
    </div>
  );
};

export default Success;
