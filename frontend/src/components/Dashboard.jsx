import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as billsActions from "../store/bills";
import * as remindersActions from "../store/reminders";
import * as budgetsActions from "../store/budgets";
import * as savingsActions from "../store/savings";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import "./Dashboard.css";
import { FaClipboardList, FaSackDollar } from "react-icons/fa6";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { GoGraph } from "react-icons/go";

function calculateDueDate(bill) {
  // Check if the bill has the required fields
  if (bill.billingDay && bill.billingFrequency && bill.billingStartMonth) {
    // Extract relevant information from the bill object
    const { billingDay, billingFrequency, billingStartMonth } = bill;

    // Get the current date
    const currentDate = new Date();

    // Calculate the next billing date based on billing frequency
    let dueDate = new Date(currentDate);

    if (billingFrequency === "every month" || billingFrequency === "monthly") {
      // Calculate the next month's billing date
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentDay = currentDate.getDate();

      if (billingDay <= currentDay) {
        // Billing day is today or earlier, move to next month
        dueDate.setMonth(currentMonth + 1);
      }

      dueDate.setDate(billingDay);
    } else if (billingFrequency === "annually" || billingFrequency === "once a year") {
      // Calculate the next year's billing date
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      dueDate = new Date(currentYear + 1, currentMonth, billingDay);

      if (dueDate <= currentDate) {
        // Increment the due date by one year
        dueDate.setFullYear(dueDate.getFullYear() + 1);
      }
    } else if (billingFrequency === "quarterly" || billingFrequency === "every quarter") {
      // Calculate quarterly billing date
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentDay = currentDate.getDate();

      // Determine the billing quarter
      const billingQuarter = Math.floor(currentMonth / 3 + 1);

      // Calculate the next quarter's billing date
      const nextQuarter = billingQuarter === 4 ? 1 : billingQuarter + 1;

      if (billingDay <= currentDay && billingQuarter) {
        // Billing day is today or earlier in the current quarter, move to next quarter
        dueDate.setMonth(nextQuarter * 3 - 1);
      } else {
        dueDate.setMonth(nextQuarter * 3 - 1);
      }

      dueDate.setDate(billingDay);
    } else {
      return null; // Return null for unsupported frequencies
    }

    // Return the calculated due date
    return dueDate;
  } else {
    // If any required field is missing, return null or handle it as needed
    return null;
  }
}

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user.user);
  const bills = useSelector((state) => state.bills.bills);
  const budgets = useSelector((state) => state.budgets.budgets);
  const savings = useSelector((state) => state.savings.savings);

  let dueBills = [];
  // MAybe fix for bills card upcoming bills (Paid or not???)
  bills?.forEach((bill) => {
    const dueDate = calculateDueDate(bill);
    if (dueDate && !bill.paid) dueBills.push({ billName: bill.billName, dueDate });
  });
  dueBills.sort((a, b) => a.dueDate - b.dueDate);

  useEffect(() => {
    if (user) {
      dispatch(billsActions.fetchBills());
      dispatch(remindersActions.fetchReminders());
      dispatch(budgetsActions.fetchBudgets());
      dispatch(savingsActions.fetchSavings());
    }
  }, [dispatch, user]);

  let totalBudget = 0;
  let totalBudgetUsed = 0;
  let totalSavings = 0;
  let savingsGoal = 0;

  for (let i = 0; i < budgets?.length; i++) {
    const budget = budgets[i];
    totalBudget += budget.budgetAmount;
  }
  for (let i = 0; i < bills?.length; i++) {
    let month = new Date();
    month = month.getMonth() + 1;

    const bill = bills[i];
    let billMonth = new Date(bill.datePaid);
    billMonth = billMonth.getMonth() + 1;
    if (bill.Budget && bill.paid && billMonth === month) totalBudgetUsed += bill.billAmount;
  }
  for (let i = 0; i < savings?.length; i++) {
    const saving = savings[i];
    totalSavings += saving.currentAmount;
  }
  for (let i = 0; i < savings?.length; i++) {
    const saving = savings[i];
    savingsGoal += saving.targetAmount;
  }

  const allData = [];

  bills?.forEach((bill) => {
    const dueDate = bill.dueDate ? new Date(bill.dueDate) : null;
    allData.push({
      type: "bill",
      name: bill.billName,
      amount: bill.billAmount.toFixed(2),
      paid: bill.paid,
      budget: bill?.Budget?.budgetName,
      date: calculateDueDate(bill),
      dueDate: dueDate ? dueDate.toLocaleDateString() : null,
      datePaid: bill.datePaid?.slice(0, 10),
    });
  });

  savings?.forEach((saving) => {
    if (saving.currentAmount > 0) {
      allData.push({
        type: "saving",
        name: saving.goalName,
        amount: saving.currentAmount,
        date: null, // No date for savings
      });
    }
  });

  // Convert the date strings to Date objects for comparison
  allData.forEach((item) => {
    if (item.dueDate) {
      item.dueDate = new Date(item.dueDate);
    }
  });

  // Sort the allData array based on dueDate and date
  allData.sort((a, b) => {
    if (!a.dueDate && !a.date && !b.dueDate && !b.date) return 0;
    if (!a.dueDate && !a.date) return 1;
    if (!b.dueDate && !b.date) return -1;

    // Compare by dueDate if available, otherwise use date
    const dateA = a.dueDate || a.date;
    const dateB = b.dueDate || b.date;

    return dateA - dateB;
  });

  // Convert the sorted Date objects back to formatted strings if needed
  allData.forEach((item) => {
    if (item.date) {
      item.date = item.date.toISOString().slice(0, 10);
    }
    if (item.dueDate) {
      item.dueDate = item.dueDate.toLocaleDateString();
    }
  });

  const data = {
    labels:
      totalBudgetUsed === totalBudget
        ? ["Remaining Budget"]
        : ["Total Budget Used", "Remaining Budget"],
    datasets: [
      {
        data:
          totalBudgetUsed === totalBudget
            ? [totalBudget]
            : [totalBudgetUsed, totalBudget - totalBudgetUsed],
        backgroundColor: ["#be3529", "#032a3e"],
        hoverBackgroundColor: ["#be3529", "#032a3e"],
      },
    ],
  };

  return (
    <>
      <div className="dashboard">
        <div>
          <Menu />
        </div>

        <div className="dashboard-content">
          <div className="dashboard-cards">
            {bills && bills.length > 0 ? (
              <Link to="/bills" className="dashboard-card">
                <div className="dashboard-card-one">
                  <h2>Bills</h2>
                  <FaClipboardList className="icon" />
                  <p>Upcoming Bills:</p>
                  <ul className="card-ul">
                    {dueBills?.slice(0, 5).map((bill) =>
                      !bill?.paid ? (
                        <li key={bill.billName}>
                          <strong> {bill.billName}</strong>: {bill.dueDate.toLocaleDateString()}
                        </li>
                      ) : (
                        ""
                      )
                    )}
                  </ul>
                </div>
              </Link>
            ) : (
              <Link to="/bills" className="dashboard-card">
                <div className="dashboard-card-one">
                  <h2>Bills</h2>
                  <FaClipboardList className="icon" />
                  <p>Upcoming Bills: none found. </p>
                </div>
              </Link>
            )}
            {budgets && budgets.length >= 1 ? (
              <Link to="/budgets" className="dashboard-card">
                <div className="dashboard-card-two">
                  <h2>Budgets</h2>
                  <GoGraph className="icon" />
                  <div className="donut-chart">
                    <Doughnut className="donut" data={data} />
                  </div>
                  <p>Total Budget: ${totalBudget}</p>
                </div>
              </Link>
            ) : (
              <Link to="/budget" className="dashboard-card">
                <div className="dashboard-card-two">
                  <h2>Budgets</h2>
                  <GoGraph className="icon" />
                  <p>Total Budget: No Budgets found.</p>
                </div>
              </Link>
            )}

            {savings && savings.length >= 1 ? (
              <Link to="/savings" className="dashboard-card">
                <div className="dashboard-card-three">
                  <h2>Savings</h2>
                  <FaSackDollar className="icon" />
                  <p className="progress-tracker">Combined Progress Made:</p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${totalSavings}%` }}>
                      {totalSavings}%
                    </div>
                  </div>

                  <p className="savings">{savings ? `Combined Saved: $${totalSavings}` : ""}</p>
                  <p className="goal">{savings ? `Combined Target Amount: $${savingsGoal}` : ""}</p>
                </div>
              </Link>
            ) : (
              <Link to="/savings" className="dashboard-card">
                <div className="dashboard-card-three">
                  <h2>Savings</h2>
                  <FaSackDollar className="icon" />
                  <p className="progress-tracker">Combined Progress Made: No Savings found.</p>
                </div>
              </Link>
            )}
          </div>

          <div className="table">
            <p className="recent">Transaction History:</p>
            {allData.length >= 1 ? (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th className="table-header">Budget</th>
                    <th className="table-header">Transactions</th>
                    <th className="table-header">Paid</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.type === "bill" ? item.budget : "-"}</td>
                      <td>{item.name}</td>
                      <td>{item.paid ? "✔️" : "❌"}</td>
                      <td>{item.amount > 0 ? `$${item.amount}` : "-"}</td>
                      <td>{item.paid ? item.datePaid : item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No Transactions to show.</p>
            )}
          </div>

          {/*  */}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
