import React from "react";
import { FaClipboardList, FaCog } from "react-icons/fa";
import { FaRegBell, FaSackDollar } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <div className="sm:flex flex-col h-64 justify-between hidden text-sapphire ">
      <Link to="/bills">
        <div className="flex items-center w-full hover:bg-crimson rounded-md hover:text-offwhite p-4">
          <FaClipboardList className="mr-3 text-lg" />
          <p>Bills</p>
        </div>
      </Link>

      <Link to="/budgets">
        <div className="flex items-center w-full hover:bg-crimson rounded-md hover:text-offwhite p-4">
          <GoGraph className="mr-3 text-lg" />
          <p>Budgets</p>
        </div>
      </Link>

      <Link to="/savings">
        <div className="flex items-center w-full hover:bg-crimson rounded-md hover:text-offwhite p-4 ">
          <FaSackDollar className="mr-3 text-lg" />
          <p>Savings</p>
        </div>
      </Link>

      <Link to="/reminders">
        <div className="flex items-center w-full hover:bg-crimson rounded-md hover:text-offwhite p-4">
          <FaRegBell className="mr-3 text-lg" />
          <p>Reminders</p>
        </div>
      </Link>

      <Link to="/account">
        <div className="flex items-center w-full hover:bg-crimson rounded-md hover:text-offwhite p-4">
          <FaCog className="mr-3 text-lg" />
          <p>Settings</p>
        </div>
      </Link>
    </div>
  );
}

export default Menu;
