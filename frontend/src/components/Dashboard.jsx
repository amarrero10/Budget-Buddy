import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as billsActions from "../store/bills";
import * as remindersActions from "../store/reminders";
import * as budgetsActions from "../store/budgets";

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user.user);
  const bills = useSelector((state) => state.bills.bills);
  const reminders = useSelector((state) => state.reminders.reminders);
  const budgets = useSelector((state) => state.budgets.budgets);

  useEffect(() => {
    if (user) {
      dispatch(billsActions.fetchBills());
      dispatch(remindersActions.fetchReminders());
      dispatch(budgetsActions.fetchBudgets());
    }
  }, [dispatch, user]);
  console.log("budgets", budgets);

  return (
    <>
      <div className="text-slate-950">
        <h1 className="text-2xl text-center">Howdy, {user.username}!</h1>
        <p className="text-xl text-center">What would you like to do?</p>
      </div>
      <h1>BILLS:</h1>
      {bills ? (
        bills.map((bill) => (
          <div key={bill.id}>
            <h1>{bill.billName}</h1>
            <a href={`${bill.paymentLink}`} rel="noreferrer" target="_blank">
              Link
            </a>
          </div>
        ))
      ) : (
        <p>No bills found.</p>
      )}
      {reminders ? (
        reminders.map((reminder) => (
          <div key={reminder.id}>
            <h1>{reminder.reminder}</h1>

            <p>{reminder.Bill ? `Bill: ${reminder.Bill.billName}` : ""}</p>
            <p>{reminder.SavingGoal ? `Goal: ${reminder.SavingGoal.goalName}` : ""}</p>
          </div>
        ))
      ) : (
        <p>No reminders found</p>
      )}
    </>
  );
}

export default Dashboard;
