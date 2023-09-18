import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as billsActions from "../store/bills";
import * as remindersActions from "../store/reminders";
import * as budgetsActions from "../store/budgets";
import * as savingsActions from "../store/savings";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import Navigation from "./Navigation";
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

  if (!user) {
    return <Redirect to="/login" />;
  }

  // <h1>BILLS:</h1>;

  // {
  //   reminders ? (
  //     reminders.map((reminder) => (
  //       <div key={reminder.id}>
  //         <h1>{reminder.reminder}</h1>

  //         <p>{reminder.Bill ? `Bill: ${reminder.Bill.billName}` : ""}</p>
  //         <p>{reminder.SavingGoal ? `Goal: ${reminder.SavingGoal.goalName}` : ""}</p>
  //       </div>
  //     ))
  //   ) : (
  //     <p>No reminders found</p>
  //   );
  // }
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
      <div className="sm:flex h-screen px-2">
        <div className="sm:w-1/6 px-2">
          <Menu />
        </div>

        <div className="sm:w-5/6 ">
          <div className="flex flex-col justify-between items-center sm:flex-row ">
            <div className="sm:w-1/3 w-full p-4 shadow-xl">
              {bills ? <p>Total bills: {allBills}</p> : <p>No bills found.</p>}
            </div>
            <div className="sm:w-1/3 w-full p-4 shadow-xl">
              {budgets ? <p>Total Budget: ${totalBudget}</p> : <p>No Budget found.</p>}
            </div>
            <div className="sm:w-1/3 w-full p-4 shadow-xl">
              {savings ? <p>Total Saved: ${totalSavings}</p> : <p>No Savings found</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
