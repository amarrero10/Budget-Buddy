import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../store/session";
import logo from "../assets/logo.png";
import Hamburger from "hamburger-react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaBell, FaCheckSquare, FaCog, FaMoneyBillWave, FaRegEdit } from "react-icons/fa";

function Navigation() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push("/");
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <Link to="/">
            <img
              src={logo}
              alt="logo for the website budget buddy"
              className="  h-24 rounded-full -ml-4 -mt-4 sm:h-36"
            ></img>
          </Link>
        </div>
        <div className="mt-1 sm:hidden">
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>

        {/* Mobile Nav Bar Menu */}
        <ul
          className={`md:hidden absolute mt-[450px] w-full px-8 ${
            isOpen === false ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
          } text-center text-xl text-offwhite transition-all duration-500 ease-in-out overflow-hidden bg-sapphire`}
        >
          <Link to="/bills">
            <div className=" flex items-center justify-center py-4">
              <FaRegEdit className="mr-3" />
              <li>Bills</li>
            </div>
          </Link>
          <hr />
          <Link to="/budget">
            <div className=" flex items-center justify-center py-4">
              <FaMoneyBillWave className="mr-3" />
              <li>Budget</li>
            </div>
          </Link>
          <hr />

          <Link to="/savings">
            <div className=" flex items-center justify-center py-4">
              <FaCheckSquare className="mr-3" />
              <li>Savings</li>
            </div>
          </Link>

          <hr />
          <Link to="/reminders">
            <div className=" flex items-center justify-center py-4">
              <FaBell className="mr-3" />
              <li>Reminders</li>
            </div>
          </Link>
          <hr />
          <Link to="/settings">
            <div className="flex items-center justify-center py-4">
              <FaCog className="mr-3" />
              <li>Settings</li>
            </div>
          </Link>

          <hr />
          <div>
            <button className="py-3 px-10 bg-crimson my-4 rounded-sm" onClick={logout}>
              Log out
            </button>
          </div>
        </ul>
        {/* End Mobile Only */}
        {/* Desktop screens */}

        <div className="hidden sm:block">
          <button
            className="  py-3 px-10 text-offwhite bg-crimson my-4 rounded-sm mr-2 -mt-2 "
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

export default Navigation;
