import React, { useEffect, useState } from "react";
import "./Budget.css";
import Menu from "./Menu";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills } from "../store/bills";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function Budget() {
  const dispatch = useDispatch();
  const budgets = useSelector((state) => state.budgets.budgets);
  const user = useSelector((state) => state.session.user.user);
  const bills = useSelector((state) => state.bills.bills);

  const [budgetTotals, setBudgetTotals] = useState({});

  useEffect(() => {
    const budgetSpent = {};

    for (let i = 0; i < budgets?.length; i++) {
      const budget = budgets[i];
      const billAmounts = [];

      for (let j = 0; j < bills?.length; j++) {
        if (bills[j].budgetId === budget.id && bills[j].paid) {
          const budgetBill = bills[j].billAmount;
          billAmounts.push(budgetBill);
        }
      }

      budgetSpent[budget.id] = billAmounts;
    }

    const newBudgetTotals = {};

    for (const budgetId in budgetSpent) {
      const billAmounts = budgetSpent[budgetId];
      const total = billAmounts.reduce((acc, amount) => acc + amount, 0);
      newBudgetTotals[budgetId] = total;
    }

    setBudgetTotals(newBudgetTotals);
  }, [bills, budgets]);

  useEffect(() => {
    // Fetch bills data when the component mounts
    dispatch(fetchBills());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
  };

  return (
    <>
      <div className="budget-page">
        <div>
          <Menu />
        </div>
        <div className="budget-section">
          <div>
            <h2 className="welcome">Welcome {user.username}!</h2>
            <div className="create-budget-container">
              <div className="budget-card">
                <h2 className="create-budget-title">Create Budget</h2>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="budget-name">Budget Name:</label>
                    <input id="budget-name" type="text" placeholder="Credit Cards"></input>
                  </div>
                  <div>
                    <label htmlFor="budget-amount">What is your total budget?</label>
                    <input id="budget-amount" type="number" placeholder="2500"></input>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
          <p>Existing Budgets:</p>
          <div className="budget-card-container">
            {budgets?.map((budget, idx) => (
              <Link to={`/budgets/${budget.id}`} key={idx}>
                <div className="budget-card">
                  <div>
                    <h2>{budget.budgetName}</h2>
                    <p>{budget.budgetAmount} budgeted</p>
                  </div>
                  <div>
                    <p>Progress Bar goes here</p>
                  </div>
                  <div>
                    <p>Money Spent: {budgetTotals[budget.id]}</p>
                    <p>{budget.budgetLeft - budgetTotals[budget.id]} remaining</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Budget;
