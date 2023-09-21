import React, { useEffect, useState } from "react";
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const user = useSelector((state) => state.session.user.user);
  const bills = useSelector((state) => state.bills.bills);
  const bill = useSelector((state) => state.bills?.bill?.billId.bill);
  const budgets = useSelector((state) => state.budgets.budgets);
  const dispatch = useDispatch();

  // EDIT BILL STUFF
  const [formData, setFormData] = useState({
    billName: "",
    paymentLink: "",
    billingDay: "",
    billingStartMonth: "",
    billingFrequency: "",
    billAmount: "",
    budgetId: "",
  });

  const handleEdit = (billId) => {
    setOpenModal(true);
    setSelectedBill(billId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setOpenModal(false);

    dispatch(billsActions.editABill(selectedBill, formData));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (selectedBill) {
      dispatch(billsActions.fetchBill(selectedBill));
    }
  }, [selectedBill, dispatch]);

  useEffect(() => {
    if (bill) {
      setFormData({
        billName: bill.billName || "",
        paymentLink: bill.paymentLink || "",
        billingDay: bill.billingDay || "",
        billingStartMonth: bill.billingStartMonth || "",
        billingFrequency: bill.billingFrequency || "",
        billAmount: bill.billAmount || "",
        budgetId: bill.budgetId || "",
        paid: bill.paid !== undefined ? bill.paid : false,
      });
    }
  }, [bill]);

  console.log("FORMDATA", formData);

  // END EDIT BILL STUFF

  const handleDelete = () => {
    console.log("clicked");
  };
  const handleMarkAsPaid = (billId, newPaidStatus) => {
    dispatch(billsActions.toggleBillPaidStatus(billId, newPaidStatus));
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

  const numberDates = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31,
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const frequency = ["monthly", "quarterly", "annually"];

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
                  <th className="table-header">Edit</th>
                  <th className="table-header">Delete</th>
                </tr>
              </thead>
              <tbody>
                {recurringBills?.map((bill, index) => (
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

                    <td className="edit">
                      <BsPencilSquare onClick={() => handleEdit(bill.id)} className="bill-icon" />
                    </td>
                    <td className="delete">
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

      {openModal && selectedBill && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="billId" value={selectedBill} />
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  onChange={handleInput}
                  id="name"
                  name="billName"
                  value={formData.billName}
                ></input>
              </div>
              <div>
                <label htmlFor="payment">Payment Link</label>
                <input
                  onChange={handleInput}
                  id="payment"
                  name="paymentLink"
                  value={formData.paymentLink}
                ></input>
              </div>
              <div>
                <p>Due Date:</p>
                <div>
                  <label>Date:</label>
                  <select onChange={handleInput} name="billingDay" value={formData.billingDay}>
                    <option>--</option>
                    {numberDates.map((date, idx) => (
                      <option key={idx}>{date}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Month:</label>
                  <select
                    onChange={handleInput}
                    name="billingStartMonth"
                    value={formData.billingStartMonth}
                  >
                    <option>--</option>
                    {months.map((month, idx) => (
                      <option key={idx} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Frequency</label>
                  <select
                    onChange={handleInput}
                    name="billingFrequency"
                    value={formData.billingFrequency}
                  >
                    <option>--</option>
                    {frequency.map((el, idx) => (
                      <option key={idx} value={el}>
                        {el}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="billAMount">Amount</label>
                <input
                  type="number"
                  onChange={handleInput}
                  id="billAmount"
                  name="billAmount"
                  value={formData.billAmount}
                  placeholder="200"
                ></input>
              </div>
              <div>
                <label>Budget</label>
                <select onChange={handleInput} name="budgetId" value={formData.budgetId}>
                  <option>--</option>
                  {budgets?.map((budget, idx) => (
                    <option key={idx} value={budget.id}>
                      {budget.budgetName}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Save Changes</button>
            </form>
            <button onClick={() => setOpenModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Bills;
