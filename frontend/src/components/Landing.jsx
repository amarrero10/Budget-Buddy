import React from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Landing.css";
import { useSelector } from "react-redux";

function Landing() {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);

  if (user) {
    history.push("/dashboard");
  }
  return (
    <div className="landing-container">
      <div className="landing-txt">
        <h1>Welcome to Budget Buddy</h1>
        <p>A Personal Finance Tool to Manage Your Budgets, Bills, Savings, and Reminders.</p>
        <div className="landing-btns">
          <Link to="signup">
            <button>Sign up</button>
          </Link>
          <Link to="login">
            <button>Log in</button>
          </Link>
        </div>
      </div>
      <div className="landing-img">
        <img src={logo} alt="Budget Buddy Company"></img>
      </div>
    </div>
  );
}

export default Landing;
