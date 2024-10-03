import React from "react";
import { Carousel } from "react-bootstrap";
import "./Brandslogo.css"; // Make sure to create this CSS file
import brand1 from "../../assets/logo/Adidas.png";
import brand2 from "../../assets/logo/669ccacaa318a_thumb900.webp";
import brand3 from "../../assets/logo/29701a938d3be4bf4a49d9dea417a608.jpg";
import brand4 from "../../assets/logo/attachment_110669556.jpeg";
import brand5 from "../../assets/logo/Gucci.png";

const brands = [
  { id: 1, src: brand1, alt: "Adidas" },
  { id: 2, src: brand2, alt: "Brand 2" },
  { id: 3, src: brand3, alt: "Brand 3" },
  { id: 4, src: brand4, alt: "Brand 4" },
  { id: 5, src: brand5, alt: "Gucci" },
];

const Brandslogo = () => {
  return (
    <div className="logo-slider">
      <Carousel pause="hover" interval={2000} variant="dark">
        {brands.map((brand) => (
          <Carousel.Item key={brand.id}>
            <img className="d-block mx-auto" src={brand.src} alt={brand.alt} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Brandslogo;
