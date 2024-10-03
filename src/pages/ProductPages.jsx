import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/Slices/ProductSlices";
import { addToCart } from "../Redux/Slices/cartSlices";
import {
  addToWishlist,
  removeFromWishlist,
} from "../Redux/Slices/WishlistSlice";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { BsHeart, BsHeartFill, BsCart, BsCartFill } from "react-icons/bs";
import toast from "react-hot-toast";
import "./styles/product.css";

const ProductPage = () => {
  const dispatch = useDispatch();

  // Select products from the Redux store
  const { products, loading, error } = useSelector((state) => state.product);
  const cart = useSelector((state) => state.cart.carts);
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Add to cart function
  const sendToCart = (product) => {
    dispatch(addToCart(product));
    toast.success("Item added to your cart");
  };

  // Add to wishlist function
  const addToWishlistHandler = (product) => {
    dispatch(addToWishlist(product));
    toast.success("Item added to your wishlist");
  };

  // Remove from wishlist function
  const removeFromWishlistHandler = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Item removed from your wishlist");
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="item_section mt-4 container">
      <div className="header-image"></div>
      <h2 className="px-4" style={{ fontWeight: 400 }}>
        Our Products
      </h2>
      <div className="row mt-2 d-flex justify-content-around align-items-center">
        {products.map((element) => (
          <Card
            key={element.id}
            style={{ width: "22rem", border: "none" }}
            className="hove mb-4"
          >
            <Card.Img variant="top" className="cd" src={element.images[0]} />
            <div className="card_body">
              <div className="upper_data d-flex justify-content-between align-items-center">
                <h4 className="mt-2">{element.name}</h4>
                {/* Display rating, assuming it's available */}
                <span>{element.rating}&nbsp;★</span>
              </div>
              <div className="lower_data d-flex justify-content-between">
                <h5>{element.description}</h5>
                {/* Assuming prices[0] exists and is in cents */}
                <span>$ {element.prices[0]?.unit_amount / 100}</span>
              </div>
              <div className="last_data d-flex justify-content-between align-items-center">
                {/* Cart Button with Icon */}
                <Button
                  variant="outline-light"
                  className="mt-2 mb-2"
                  onClick={() => {
                    if (!isInCart(element.id)) {
                      sendToCart(element);
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {isInCart(element.id) ? (
                    <BsCartFill size={24} className="text-success" />
                  ) : (
                    <BsCart size={24} className="text-success" />
                  )}
                </Button>

                {/* Wishlist Button */}
                <Button
                  variant="outline-light"
                  className="mt-2 mb-2"
                  onClick={() => {
                    isInWishlist(element.id)
                      ? removeFromWishlistHandler(element.id)
                      : addToWishlistHandler(element);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ff3054")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "inherit")
                  }
                >
                  {isInWishlist(element.id) ? (
                    <BsHeartFill size={24} className="text-danger" />
                  ) : (
                    <BsHeart size={24} className="text-danger" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProductPage;
