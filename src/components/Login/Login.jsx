import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Redux/Slices/UserSlices/UserSlice"; // Adjust the import path
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch(); // Initialize useDispatch
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await dispatch(loginUser(formData)).unwrap(); // Unwrap for direct error handling
        toast.success("Login successful!");
        navigate("/"); // Redirect to home page
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      }
    } else {
      Object.values(newErrors).forEach((error) => toast.error(error));
    }
  };

  return (
    <MDBContainer
      fluid
      className="h-100 d-flex justify-content-center align-items-center"
    >
      <ToastContainer />
      <MDBCard
        className="text-black m-3"
        style={{ borderRadius: "25px", maxWidth: "900px" }}
      >
        <MDBRow className="g-0">
          {/* Left Side - Image */}
          <MDBCol md="6">
            <MDBCardImage
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              alt="Sample image"
              fluid
              className="w-100 h-100"
              style={{ borderRadius: "25px 0 0 25px" }}
            />
          </MDBCol>

          {/* Right Side - Form */}
          <MDBCol md="6" className="d-flex align-items-center">
            <MDBCardBody className="p-4 p-lg-5 text-black">
              <h2 className="fw-bold mb-5 text-center">Login</h2>

              {/* Email Input */}
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="envelope me-3" size="lg" />
                <MDBInput
                  label="Your Email"
                  id="loginEmail"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-100"
                />
              </div>
              {errors.email && <p className="text-danger">{errors.email}</p>}

              {/* Password Input */}
              <div className="d-flex flex-row align-items-center mb-4 position-relative">
                <MDBIcon fas icon="lock me-3" size="lg" />
                <MDBInput
                  label="Password"
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-100"
                />
                <MDBIcon
                  icon={showPassword ? "eye-slash" : "eye"}
                  onClick={togglePasswordVisibility}
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: "pointer" }}
                />
              </div>
              {errors.password && (
                <p className="text-danger">{errors.password}</p>
              )}

              {/* Login Button */}
              <MDBBtn className="mb-4 w-100" size="lg" onClick={handleSubmit}>
                Login
              </MDBBtn>

              {/* Navigate to Signup */}
              <div className="text-center">
                <p>Don't have an account?</p>
                <MDBBtn
                  color="secondary"
                  size="lg"
                  onClick={() => navigate("/signup")} // Redirect to signup page
                >
                  Go to Signup
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
