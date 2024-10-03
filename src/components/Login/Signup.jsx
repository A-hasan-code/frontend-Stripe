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
  MDBCheckbox,
} from "mdb-react-ui-kit";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    phone: "",
    address: "",
    file: null,
    newsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhoneChange = (phone) => {
    setFormData((prevData) => ({ ...prevData, phone }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFormData((prevData) => ({ ...prevData, file: selectedFile }));
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword((prev) => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.repeatPassword)
      newErrors.repeatPassword = "Please repeat your password";
    if (formData.password !== formData.repeatPassword)
      newErrors.repeatPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", formData.name);
        formDataToSubmit.append("email", formData.email);
        formDataToSubmit.append("password", formData.password);
        formDataToSubmit.append("phoneNumber", formData.phone); // Ensure this matches the backend
        formDataToSubmit.append("address", formData.address);
        formDataToSubmit.append("avatar", formData.file); // Changed to match the backend
        formDataToSubmit.append("newsletter", formData.newsletter);

        await axios.post(
          "http://localhost:3000/api/register",
          formDataToSubmit
        );
        toast.success("Registration successful!");
        navigate("/login");
      } catch (error) {
        if (error.response) {
          toast.error(
            error.response.data.message ||
              "Registration failed. Please try again."
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
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
        style={{
          borderRadius: "25px",
          maxWidth: "700px",
          height: "auto",
          overflowY: "auto",
        }}
      >
        <MDBCardBody>
          <MDBRow>
            <MDBCol
              md="10"
              lg="6"
              className="order-2 order-lg-1 d-flex flex-column align-items-center"
            >
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                Sign up
              </p>

              {/* Name Input */}
              <div className="d-flex flex-row align-items-center mb-4 w-100">
                <MDBIcon fas icon="user me-3" size="lg" />
                <MDBInput
                  label="Your Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-100"
                />
              </div>

              {/* Email Input */}
              <div className="d-flex flex-row align-items-center mb-4 w-100">
                <MDBIcon fas icon="envelope me-3" size="lg" />
                <MDBInput
                  label="Your Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-100"
                />
              </div>

              {/* Password Input */}
              <div className="d-flex flex-row align-items-center mb-4 w-100 position-relative">
                <MDBIcon fas icon="lock me-3" size="lg" />
                <MDBInput
                  label="Password"
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

              {/* Repeat Password */}
              <div className="d-flex flex-row align-items-center mb-4 w-100 position-relative">
                <MDBIcon fas icon="key me-3" size="lg" />
                <MDBInput
                  label="Repeat your password"
                  type={showRepeatPassword ? "text" : "password"}
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  className="w-100"
                />
                <MDBIcon
                  icon={showRepeatPassword ? "eye-slash" : "eye"}
                  onClick={toggleRepeatPasswordVisibility}
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: "pointer" }}
                />
              </div>

              {/* Phone Input */}
              <div className="d-flex flex-row align-items-center mb-4 w-100">
                <MDBIcon fas icon="phone-alt me-3" size="lg" />
                <PhoneInput
                  country={"us"}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputStyle={{ width: "100%" }}
                />
              </div>

              {/* Address Input */}
              <div className="d-flex flex-row align-items-center mb-4 w-100">
                <MDBIcon fas icon="home me-3" size="lg" />
                <MDBInput
                  label="Your Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-100"
                />
              </div>

              {/* File Upload & Preview */}
              <div className="d-flex flex-column align-items-center mb-4 w-100">
                {!preview ? (
                  <>
                    <MDBIcon
                      fas
                      icon="file-upload"
                      size="lg"
                      style={{ cursor: "pointer" }}
                    />
                    <p className="text-muted">Choose an image</p>
                    <input
                      type="file"
                      accept="image/*"
                      id="fileUpload"
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  <div className="mt-3">
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Newsletter Checkbox */}
              <div className="mb-4">
                <MDBCheckbox
                  name="newsletter"
                  id="flexCheckDefault"
                  label="Subscribe to our newsletter"
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      newsletter: e.target.checked,
                    }))
                  }
                />
              </div>

              {/* Submit Button */}
              <MDBBtn className="mb-4" size="lg" onClick={handleSubmit}>
                Register
              </MDBBtn>

              {/* Sign In Button */}
              <MDBBtn
                color="secondary"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Sign In
              </MDBBtn>
            </MDBCol>

            {/* Image Column */}
            <MDBCol
              md="10"
              lg="6"
              className="order-1 order-lg-2 d-flex align-items-center"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                fluid
                className="img-fluid"
                alt="Sample image"
              />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Signup;
