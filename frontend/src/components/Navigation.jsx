import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../store/session";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom/cjs/react-router-dom";
import "./Navigation.css";

function Navigation() {
  const history = useHistory();
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(() => {
      history.push("/");
    });
  };

  return (
    <>
      <div className="nav-bar">
        <div>
          <Link to="/">
            <img src={logo} alt="logo for the website budget buddy"></img>
          </Link>
        </div>
        <div>
          <button className="nav-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

export default Navigation;
