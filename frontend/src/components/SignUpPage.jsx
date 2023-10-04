import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaLock, FaPortrait, FaRegEnvelope, FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../store/session";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import "./SignUp.css";

function SignUpPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");

  if (sessionUser) return <Redirect to="/dashboard" />;
  const validateForm = () => {
    const newErrors = {};

    if (!firstName) {
      newErrors.firstName = "First Name is required";
    } else if (firstName.length < 3) {
      newErrors.firstName = "First Name must be at least 4 characters";
    }

    if (!lastName) {
      newErrors.lastName = "Last Name is required";
    } else if (lastName.length < 3) {
      newErrors.lastName = "First Name must be at least 4 characters";
    }

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      // Passwords do not match, set an error message
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const signup = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        sessionActions.signup({
          username,
          firstName,
          lastName,
          email,
          password,
        })
      );

      history.push("/dashboard");
    } catch (err) {
      const data = await err.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={signup} className="signup-form">
          <h2 className="signup-title">Welcome to Budget Buddy, your personal finance tool!</h2>
          <div className="input-section">
            <label htmlFor="firstName">First Name:</label>
            <div className="input-icon">
              <FaPortrait className="signup-icon" />
              <input
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                type="text"
                className="input"
              ></input>
            </div>
            {errors.firstName && <p className="error-text">{errors.firstName}</p>}
          </div>
          <div className="input-section">
            <label htmlFor="lastName">Last Name:</label>
            <div className="input-icon">
              <FaPortrait className="signup-icon" />
              <input
                className="input"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                type="text"
              ></input>
            </div>
            {errors.lastName && <p className="error-text">{errors.lastName}</p>}
          </div>
          <div className="input-section">
            <label htmlFor="username">User Name:</label>
            <div className="input-icon">
              <FaUserCircle className="signup-icon" />
              <input
                className="input"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john-doe"
                required
                type="text"
              ></input>
            </div>
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
          <div className="input-section">
            <label htmlFor="email">Email:</label>
            <div className="input-icon">
              <FaRegEnvelope className="signup-icon" />
              <input
                className="input"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                required
                type="email"
              ></input>
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="input-section">
            <label htmlFor="password" className="text-xl">
              Password:
            </label>
            <div className="input-icon">
              <FaLock className="signup-icon" />
              <input
                className="input"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                type="password"
              ></input>
            </div>

            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <div className="input-section">
            <label htmlFor="confirmPassword" className="text-xl">
              Confirm Password:
            </label>
            <div className="input-icon">
              <FaLock className="signup-icon" />
              <input
                className="input"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••"
                required
                type="password"
              ></input>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="signup-btn"
          >
            Sign Up!
          </motion.button>

          <p>
            Already Have an account? Log in{" "}
            <Link to="/login" className="signup-link">
              Here
            </Link>
            !
          </p>
        </form>
        {errors.length > 0 && (
          <div className="error-messages">
            <ul>
              {errors.map((error, index) => (
                <li key={index} className="error-text">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default SignUpPage;
