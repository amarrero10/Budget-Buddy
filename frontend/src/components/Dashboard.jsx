import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as billsActions from "../store/bills";
import * as remindersActions from "../store/reminders";
import * as budgetsActions from "../store/budgets";
import * as savingsActions from "../store/savings";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import Menu from "./Menu";

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user.user);
  const bills = useSelector((state) => state.bills.bills);
  const reminders = useSelector((state) => state.reminders.reminders);
  const budgets = useSelector((state) => state.budgets.budgets);
  const savings = useSelector((state) => state.savings.savings);

  useEffect(() => {
    if (user) {
      dispatch(billsActions.fetchBills());
      dispatch(remindersActions.fetchReminders());
      dispatch(budgetsActions.fetchBudgets());
      dispatch(savingsActions.fetchSavings());
    }
  }, [dispatch, user]);

  let allBills = bills?.length;
  let totalBudget = 0;
  let totalSavings = 0;

  for (let i = 0; i < budgets?.length; i++) {
    const budget = budgets[i];
    totalBudget += budget.budgetAmount;
  }
  for (let i = 0; i < savings?.length; i++) {
    const saving = savings[i];
    totalSavings += saving.currentAmount;
  }

  return (
    <>
      <div>
        <div>
          <Menu />
        </div>

        <div>
          <div>
            <div>{bills ? <p>Total bills: {allBills}</p> : <p>No bills found.</p>}</div>
            <div>{budgets ? <p>Total Budget: ${totalBudget}</p> : <p>No Budget found.</p>}</div>
            <div>{savings ? <p>Total Saved: ${totalSavings}</p> : <p>No Savings found</p>}</div>
          </div>
          <div>
            <p>Recent Activity</p>
            <table>
              <thead>
                <tr>
                  <th>Budget</th>
                  <th>Transaction Type</th>
                  <th>Amount</th>
                  <th>Date</th>
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
