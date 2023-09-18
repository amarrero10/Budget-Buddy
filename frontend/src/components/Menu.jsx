import React from "react";
import { FaClipboardList, FaCog } from "react-icons/fa";
import { FaRegBell, FaSackDollar } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <div>
      <Link to="/bills">
        <div>
          <FaClipboardList />
          <p>Bills</p>
        </div>
      </Link>

      <Link to="/budgets">
        <div>
          <GoGraph />
          <p>Budgets</p>
        </div>
      </Link>

      <Link to="/savings">
        <div>
          <FaSackDollar />
          <p>Savings</p>
        </div>
      </Link>

      <Link to="/reminders">
        <div>
          <FaRegBell />
          <p>Reminders</p>
        </div>
      </Link>

      <Link to="/account">
        <div>
          <FaCog />
          <p>Settings</p>
        </div>
      </Link>
    </div>
  );
}

export default Menu;
