import React, { useEffect, useState } from "react";
import "./BudgetProgress.css";

function BudgetProgressBars({ data }) {
  const [budgetTotals, setBudgetTotals] = useState({});

  useEffect(() => {
    const newBudgetTotals = {};

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    for (let i = 0; i < data?.length; i++) {
      const budget = data[i];
      const billAmounts = [];

      // Iterate through the bills within the budget
      for (let j = 0; j < budget.Bills?.length; j++) {
        const bill = budget.Bills[j];

        // Check if the bill is paid
        if (bill.paid) {
          // Parse the bill's datePaid into a Date object
          const billDate = new Date(bill.datePaid);

          // Adjust the bill's date by adding the time zone offset in minutes
          const offset = billDate.getTimezoneOffset();
          billDate.setMinutes(billDate.getMinutes() + offset);

          // Extract the month and year from the adjusted date
          const billMonth = billDate.getMonth() + 1; // Add 1 to match the current month format
          const billYear = billDate.getFullYear();

          // Check if the bill's month and year match the current month and year
          if (billMonth === currentMonth && billYear === currentYear) {
            billAmounts.push(bill.billAmount);
          }
        }
      }

      // Calculate the total spent for this budget
      const total = billAmounts.reduce((acc, amount) => acc + amount, 0);
      newBudgetTotals[budget.id] = total;
    }

    setBudgetTotals(newBudgetTotals);
  }, [data]);

  return (
    <div className="budget-progress-bars">
      {data?.map((budget) => (
        <div key={budget.id} className="budget-progress-bar">
          <div className="budget-name">
            <p>{budget.budgetName}</p>
          </div>

          <div className="budget-progress-container">
            {(budgetTotals[budget.id] / budget.budgetAmount) * 100 <= 100 ? (
              <div
                className="budget-progress"
                style={{
                  width: `${(budgetTotals[budget.id] / budget.budgetAmount) * 100}%`,
                }}
              ></div>
            ) : (
              <div
                className="budget-progress"
                style={{
                  width: `100%`,
                }}
              ></div>
            )}
          </div>
          <div className="percent">
            {Math.floor((budgetTotals[budget.id] / budget.budgetAmount) * 100)}%
          </div>
          <div className="budget-details">
            <div className="budget-spent">
              ${parseFloat(budgetTotals[budget?.id]).toFixed(2)} spent
            </div>
            <div
              className={
                (budgetTotals[budget.id] / budget.budgetAmount) * 100 <= 100
                  ? "budget-remaining"
                  : "budget-red"
              }
            >
              ${(budget?.budgetAmount - budgetTotals[budget?.id]).toFixed(2)} remaining
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BudgetProgressBars;
