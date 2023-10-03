import React from "react";
import { useSelector } from "react-redux";
import Menu from "./Menu";
import "./Savings.css";

function Savings() {
  const savings = useSelector((state) => state.savings?.savings);

  console.log("SAVINGS", savings);
  return (
    <>
      <div className="savings-page">
        <div>
          <Menu />
        </div>
        <div>
          <p>Coming Soon</p>
        </div>
      </div>
    </>
  );
}

export default Savings;
