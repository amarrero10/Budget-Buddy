import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import * as sessionActions from "../store/session";
import { motion as m } from "framer-motion";
import "./SignUp.css";
import { FaLock, FaUserCircle } from "react-icons/fa";

function LogInPage() {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  if (sessionUser) return <Redirect to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await dispatch(sessionActions.login({ credential, password }));
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  const handleDemoUser = async (e) => {
    e.preventDefault();

    await dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }));
  };
  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h1>Welcome to Budget Buddy!</h1>
          <div className="input-section">
            <label htmlFor="credential">Username or Email:</label>
            <div className="input-icon">
              <FaUserCircle className="signup-icon" />
              <input
                className="input"
                type="text"
                id="credential"
                name="credential"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-section">
            <label htmlFor="password">Password:</label>
            <div className="input-icon">
              <FaLock className="signup-icon" />
              <input
                className="input"
                type="password"
                required
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="login-btns">
            <div>
              <m.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={handleDemoUser}
                className="signup-btn"
                type="button"
              >
                Demo User
              </m.button>
            </div>
            <div>
              <m.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                type="submit"
                className="signup-btn"
              >
                Log in
              </m.button>
            </div>
          </div>
          <p>
            Don't have an account? Sign Up{" "}
            <Link to="/signup" className=" signup-link">
              Here
            </Link>
            !
          </p>
          {errors.credential && <p className="error-text">{errors.credential} Please try again.</p>}
        </form>
      </div>
    </>
  );
}

export default LogInPage;
