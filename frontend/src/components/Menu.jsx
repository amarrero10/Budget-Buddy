import React from "react";
import { FaClipboardList, FaCog } from "react-icons/fa";
import { FaRegBell, FaSackDollar } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { Link } from "react-router-dom";
import "./Menu.css";

function Menu() {
  return (
    <div className="menu">
      <Link to="/bills">
        <div className="menu-option">
          <FaClipboardList className="menu-icon" />
          <p>Bills</p>
        </div>
      </Link>

      <Link to="/budgets">
        <div className="menu-option">
          <GoGraph className="menu-icon" />
          <p>Budgets</p>
        </div>
      </Link>

      <Link to="/savings">
        <div className="menu-option">
          <FaSackDollar className="menu-icon" />
          <p>Savings</p>
        </div>
      </Link>

      <Link to="/reminders">
        <div className="menu-option">
          <FaRegBell className="menu-icon" />
          <p>Reminders</p>
        </div>
      </Link>

      {/* <Link to="/account">
        <div className="menu-option">
          <FaCog className="menu-icon" />
          <p>Settings</p>
        </div>
      </Link> */}
    </div>
  );
}

export default Menu;
