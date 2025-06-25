// Login.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    try {
    //   const response = await axios.post("/login", formData);

      // if (response.status === 200) {
      //     console.log(response.data.message);
      //     const userData = {...response.data.user};
      sessionStorage.setItem(
        "user",
        JSON.stringify({ email: formData.email })
      );
      navigate("/");

      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              name="email"
              className="form-control rounded-0"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              id="password"
              name="password"
              className="form-control rounded-0"
              required
            />
          </div>
          <button className="btn btn-success w-100 mb-2">Log In</button>
          <Link
            to="/signup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
