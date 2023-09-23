import React, { useEffect, useState } from "react";
import "./BudgetProgress.css";

function BudgetProgressBars({ data }) {
  const [budgetTotals, setBudgetTotals] = useState({});

  useEffect(() => {
    const newBudgetTotals = {};
    const budgetSpent = {};

    for (let i = 0; i < data?.length; i++) {
      const budget = data[i];
      const billAmounts = [];

      for (let j = 0; j < budget.Bills?.length; j++) {
        if (budget.Bills[j].budgetId === budget.id && budget.Bills[j].paid) {
          const budgetBill = budget.Bills[j].billAmount;
          billAmounts.push(budgetBill);
        }
      }

      budgetSpent[budget.id] = billAmounts;
    }

    for (const budgetId in budgetSpent) {
      const billAmounts = budgetSpent[budgetId];
      const total = billAmounts.reduce((acc, amount) => acc + amount, 0);
      newBudgetTotals[budgetId] = total;
    }

    setBudgetTotals(newBudgetTotals);
  }, [data]);

  return (
    <div className="budget-progress-bars">
      {data.map((budget) => (
        <div key={budget.id} className="budget-progress-bar">
          <div className="budget-name">
            <p>{budget.budgetName}</p>
          </div>
          <div className="budget-progress-container">
            <div
              className="budget-progress"
              style={{
                width: `${(budgetTotals[budget.id] / budget.budgetAmount) * 100}%`,
              }}
            ></div>
          </div>
          <div className="percent">
            {Math.floor((budgetTotals[budget.id] / budget.budgetAmount) * 100)}%
          </div>
          <div className="budget-details">
            <div className="budget-spent">${budgetTotals[budget.id]} spent</div>
            <div className="budget-remaining">
              ${budget.budgetAmount - budgetTotals[budget.id]} remaining
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BudgetProgressBars;
