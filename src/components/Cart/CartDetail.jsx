// src/components/CartDetails.js
import React, { useEffect, useState } from "react";
import "./cartstyles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  removeFromCart,
  removeSingleItem,
  emptyCart,
} from "../../Redux/Slices/cartSlices";
import { checkAuth, fetchUser } from "../../Redux/Slices/UserSlices/UserSlice";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const CartDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { carts } = useSelector((state) => state.cart);
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [email, setEmail] = useState(userInfo?.email || "");
  console.log(email); // Set initial email from user info if available
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
    if (isAuthenticated && !userInfo) {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, userInfo, dispatch]);

  useEffect(() => {
    const calculateTotals = () => {
      const price = carts.reduce(
        (acc, item) => acc + item.prices[0].unit_amount * item.qnty,
        0
      );
      const quantity = carts.reduce((acc, item) => acc + item.qnty, 0);
      setTotalPrice(price / 100);
      setTotalQuantity(quantity);
    };
    calculateTotals();
  }, [carts]);

  const handleIncrement = (item) => dispatch(addToCart(item));
  const handleDecrement = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success("Item removed from your cart");
  };
  const handleSingleDecrement = (item) => dispatch(removeSingleItem(item));
  const handleEmptyCart = () => {
    dispatch(emptyCart());
    toast.success("Your cart is empty");
  };

  const makePayment = async () => {
    setIsCheckingOut(true);
    const stripe = await loadStripe(
      "pk_test_51Q2yDdB1OlLYzSjpc1N6Jib2gKtcThTDsThu7tXChUlsTofamN6tkLOCviI7wQLx2H5qUxL9ZqYYuOSD8HX0Iyc700YnXxmupV"
    );

    if (!email) {
      toast.error("Please enter your email before proceeding.");
      setIsCheckingOut(false);
      return;
    }

    console.log("Email for checkout:", email); // Debugging email

    const body = {
      products: carts.map((item) => ({
        name: item.name,
        images: item.images,
        prices: item.prices,
        qnty: item.qnty,
      })),
      email,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/create-checkout-session",
        body
      );
      console.log("Stripe session response:", response.data); // Debugging response

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        console.error(result.error);
        toast.error("An error occurred during the payment process.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred while processing payment.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      if (!email) {
        toast.error("Please provide an email to proceed with checkout.");
        return;
      }
      makePayment();
    }
  };

  return (
    <div className="row justify-content-center m-0">
      <div className="col-md-8 mt-5 mb-5 cardsdetails">
        <div className="card">
          <div className="card-header bg-dark p-3">
            <h5 className="text-white m-0">
              Cart Calculation {carts.length > 0 ? `(${carts.length})` : ""}
            </h5>
            {isAuthenticated && userInfo && (
              <div className="user-info">
                <p className="text-white">
                  Logged in as: {userInfo.name || userInfo.email}
                </p>
              </div>
            )}
            {carts.length > 0 && (
              <button
                className="btn btn-danger mt-0 btn-sm"
                onClick={handleEmptyCart}
              >
                <i className="fa fa-trash-alt mr-2"></i>
                <span>Empty Cart</span>
              </button>
            )}
          </div>
          <div className="card-body p-0">
            {carts.length === 0 ? (
              <div className="cart-empty">
                <i className="fa fa-shopping-cart"></i>
                <p>Your Cart Is Empty</p>
              </div>
            ) : (
              <table className="table cart-table mb-0">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((data, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          className="prdct-delete"
                          onClick={() => handleDecrement(data.id)}
                          aria-label={`Remove ${data.name} from cart`}
                        >
                          <i className="fa fa-trash-alt"></i>
                        </button>
                      </td>
                      <td>
                        <img
                          src={data.images[0]}
                          alt={data.name}
                          style={{ width: "100px", height: "auto" }}
                        />
                      </td>
                      <td>{data.name}</td>
                      <td>
                        USD {(data.prices[0]?.unit_amount / 100).toFixed(2)}
                      </td>
                      <td>
                        <div className="prdct-qty-container">
                          <button
                            className="prdct-qty-btn"
                            type="button"
                            onClick={
                              data.qnty <= 1
                                ? () => handleDecrement(data.id)
                                : () => handleSingleDecrement(data)
                            }
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                          <input
                            type="text"
                            className="qty-input-box"
                            value={data.qnty}
                            disabled
                          />
                          <button
                            className="prdct-qty-btn"
                            type="button"
                            onClick={() => handleIncrement(data)}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td className="text-right">
                        USD{" "}
                        {(
                          (data.prices[0]?.unit_amount / 100) *
                          data.qnty
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>&nbsp;</th>
                    <th colSpan={2}>&nbsp;</th>
                    <th>
                      Items In Cart:{" "}
                      <span className="text-danger">{totalQuantity}</span>
                    </th>
                    <th className="text-right">
                      Total Price:{" "}
                      <span className="text-danger">
                        USD {totalPrice.toFixed(2)}
                      </span>
                    </th>
                    <th className="text-right">
                      <button
                        className="btn btn-success"
                        onClick={handleCheckout}
                        type="button"
                        disabled={isCheckingOut}
                      >
                        {isCheckingOut ? "Processing..." : "Checkout"}
                      </button>
                    </th>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDetails;
