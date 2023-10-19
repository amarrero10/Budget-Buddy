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
          <p>Welcome to your savings page</p>
          <div className="savings-card-container">
            {savings.map((saving) => {
              return (
                <div className=" savings-card">
                  <div className="savings-info-and-btns">
                    <div className="savings-info">
                      <p className="saving-name">{saving.goalName}</p>
                      <p>
                        <span className="saving-amounts">Target: </span> ${saving.targetAmount}
                      </p>
                      <p>
                        <span className="saving-amounts">Current: </span> ${saving.currentAmount}
                      </p>
                    </div>
                    <div className="savings-btns">
                      <button className="nav-btn">Edit</button>
                      <button className="nav-btn">Delete</button>
                      <button className="nav-btn">Contribute</button>
                    </div>
                  </div>
                  <p>PROGRESS BAR</p>
                </div>
              );
            })}
          </div>
          <button className="nav-btn add-saving">Add a savings goal</button>
        </div>
      </div>
    </>
  );
}

export default Savings;
