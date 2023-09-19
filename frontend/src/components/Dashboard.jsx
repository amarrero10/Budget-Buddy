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

    if (billingFrequency === "monthly") {
      // For monthly bills, set the day of the next month to the billing day
      dueDate.setMonth(currentDate.getMonth() + 1);
      dueDate.setDate(billingDay);
    } else if (billingFrequency === "annually") {
      // For annual bills, set the same day and month next year
      dueDate.setFullYear(currentDate.getFullYear() + 1);
      dueDate.setDate(billingDay);
    } else {
      // Handle other billing frequencies as needed
      // For example, handle quarterly, semi-annual, etc.
      // You can add additional logic here
      return null; // Return null for unsupported frequencies
    }

    // Check if the calculated date is in the past (e.g., if billing day is today or earlier)
    if (dueDate <= currentDate) {
      // Increment the due date by one billing cycle
      if (billingFrequency === "monthly") {
        dueDate.setMonth(dueDate.getMonth() + 1);
      } else if (billingFrequency === "annually") {
        dueDate.setFullYear(dueDate.getFullYear() + 1);
      }
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
  const reminders = useSelector((state) => state.reminders.reminders);
  const budgets = useSelector((state) => state.budgets.budgets);
  const savings = useSelector((state) => state.savings.savings);

  let dueBills = [];
  bills?.forEach((bill) => {
    const dueDate = calculateDueDate(bill);
    if (dueDate) dueBills.push({ billName: bill.billName, dueDate });
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
    const bill = bills[i];
    if (bill.Budget && bill.paid) totalBudgetUsed += bill.billAmount;
  }
  for (let i = 0; i < savings?.length; i++) {
    const saving = savings[i];
    totalSavings += saving.currentAmount;
  }
  for (let i = 0; i < savings?.length; i++) {
    const saving = savings[i];
    savingsGoal += saving.targetAmount;
  }

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
            {bills ? (
              <Link to="/bills" className="dashboard-card">
                <div className="dashboard-card-one">
                  <h2>Bills</h2>
                  <FaClipboardList className="icon" />
                  <p>Upcoming Bills:</p>
                  <ul className="card-ul">
                    {dueBills?.slice(0, 5).map((bill) => (
                      <li key={bill.billName}>
                        <strong> {bill.billName}</strong>: {bill.dueDate.toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ) : (
              <p>No Bills found</p>
            )}

            <Link to="/budget" className="dashboard-card">
              <div className="dashboard-card-two">
                <h2>Budgets</h2>
                <GoGraph className="icon" />
                <div className="donut-chart">
                  <Doughnut className="donut" data={data} />
                </div>
                <p>Total Budget: ${totalBudget}</p>
              </div>
            </Link>

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
          </div>
          <div>
            <p>Recent Activity</p>
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="table-header">Budget</th>
                  <th className="table-header">Transaction Type</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                  <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                  <td>Malcolm Lockyer</td>
                  <td>1961</td>
                </tr>
                <tr>
                  <td>Witchy Woman</td>
                  <td>The Eagles</td>
                  <td>1972</td>
                </tr>
                <tr>
                  <td>Shining Star</td>
                  <td>Earth, Wind, and Fire</td>
                  <td>1975</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
