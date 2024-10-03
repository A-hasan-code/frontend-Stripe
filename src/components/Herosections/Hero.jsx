import React from "react";
import { Button } from "react-bootstrap";
import "./hero.css"; // Make sure to create this CSS file

const Hero = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Our Store</h1>
        <p>Discover the latest trends in fashion and accessories.</p>
        <Button variant="primary" size="lg" href="/shop">
          Shop Now
        </Button>
      </div>
    </div>
  );
};

export default Hero;
