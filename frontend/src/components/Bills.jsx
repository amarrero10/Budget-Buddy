import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as billsActions from "../store/bills";
import Menu from "./Menu";
import "./Bills.css";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";

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
      // Calculate the next month's billing date
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentDay = currentDate.getDate();

      if (billingDay <= currentDay) {
        // Billing day is today or earlier, move to next month
        dueDate.setMonth(currentMonth + 1);
      }

      dueDate.setDate(billingDay);
    } else if (billingFrequency === "annually") {
      // Calculate the next year's billing date
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      dueDate = new Date(currentYear + 1, currentMonth, billingDay);

      if (dueDate <= currentDate) {
        // Increment the due date by one year
        dueDate.setFullYear(dueDate.getFullYear() + 1);
      }
    } else {
      // Handle other billing frequencies as needed
      // For example, handle quarterly, semi-annual, etc.
      // You can add additional logic here
      return null; // Return null for unsupported frequencies
    }

    // Return the calculated due date
    return dueDate;
  } else {
    // If any required field is missing, return null or handle it as needed
    return null;
  }
}

function Bills() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user.user);
  const bills = useSelector((state) => state.bills.bills);
  const handleDelete = () => {
    console.log("clicked");
  };
  const handleMarkAsPaid = (billId, newPaidStatus) => {
    dispatch(billsActions.toggleBillPaidStatus(billId, newPaidStatus));
  };

  const handleEdit = () => {
    console.log("clicked");
  };

  useEffect(() => {}, [bills]);

  // GET ONLY RECURRING BILLS
  let recurringBills = bills?.filter((bill) => bill.dueDate === null);

  let oneTimeBills = bills?.filter((bill) => bill.dueDate !== null);

  // Change due date to nice date format
  bills?.forEach((bill) => {
    const dueDate = bill.dueDate ? new Date(bill.dueDate) : null;
    if (bill.dueDate) {
      bill.dueDate = dueDate.toLocaleDateString();
    }
  });

  recurringBills.sort((a, b) => calculateDueDate(a) - calculateDueDate(b));

  return (
    <>
      <button className="nav-btn bill-btn">Add A Bill</button>
      <div className="bills-page">
        <div>
          <Menu />
        </div>
        <div className="bill-tables">
          <div>
            <p>Recurring Bills:</p>
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="table-header">Paid</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header">Edit/Delete</th>
                </tr>
              </thead>
              <tbody>
                {recurringBills?.map((bill) => (
                  <tr key={bill.id} className={bill.paid ? "paid" : ""}>
                    <td>
                      <div className="bill-paid">
                        <button
                          onClick={() => handleMarkAsPaid(bill.id, !bill.paid)}
                          className={`check-button ${bill.paid ? "checked" : ""}`}
                        >
                          &#10003; {/* Checkmark symbol */}
                        </button>
                      </div>
                    </td>
                    <td>{bill.billName}</td>
                    <td>{bill.billAmount}</td>
                    <td>
                      {bill?.dueDate ? bill.dueDate : calculateDueDate(bill)?.toLocaleDateString()}
                    </td>

                    <td className="edit-delete">
                      <BsPencilSquare onClick={() => handleEdit(bill.id)} className="bill-icon" />
                      <BsTrash3 onClick={() => handleDelete(bill.id)} className="bill-delete" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p>Non-Recurring Bills:</p>
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {oneTimeBills?.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.billName}</td>
                    <td>{bill.billAmount}</td>
                    <td>
                      {bill?.dueDate ? bill.dueDate : calculateDueDate(bill)?.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Bills;
