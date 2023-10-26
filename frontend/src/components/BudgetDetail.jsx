import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as budgetActions from "../store/budgets";
import Menu from "./Menu";
import * as billsActions from "../store/bills";
import "./BudgetDetail.css";

function BudgetDetail() {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budgets.budget);
  const { id } = useParams();
  const [resetModal, setResetModal] = useState(false);
  const [isRecurring, setIsRecurring] = useState(null);
  const [addFormData, setAddFormData] = useState({
    billName: "",
    paymentLink: "",
    billingDay: "",
    billingStartMonth: "",
    billingFrequency: "",
    billAmount: "",
    dueDate: "",
    datePaid: "",
    budgetId: "",
    isRecurring: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!addFormData.billName) {
      errors.billName = "Name is required";
    } else if (addFormData.billName.length < 3) {
      errors.billName = "Name must be 3 characters or greater";
    }

    if (!addFormData.dueDate) {
      errors.dueDate = "Date Paid is required";
    }

    if (!addFormData.billAmount) {
      errors.billAmount = "Amount is required";
    } else if (addFormData.billAmount < 1) {
      errors.billAmount = "Amount must be at least 1";
    }

    if (isRecurring) {
      if (!addFormData.billingDay) {
        errors.billingDay = "Date is required";
      }
    }

    if (addFormData.isRecurring === "") {
      errors.isRecurring = " Selection is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleRadioChange = (e) => {
    const value = e.target.value === "true"; // Convert the string to a boolean

    setIsRecurring(value); // Update the isRecurring state correctly

    setAddFormData((prevFormData) => ({
      ...prevFormData,
      isRecurring: value, // Update the isRecurring field in the formData
    }));
  };

  // Get the current date
  const currentDate = new Date();

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  // Convert the first and last day to ISO date strings (yyyy-mm-dd)
  const minDate = firstDayOfMonth.toISOString().split("T")[0];
  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, "0");

  let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

  let currentYear = date.getFullYear();

  // we will display the date as DD-MM-YYYY

  let currentDated = `${currentYear}-${currentMonth}-${currentDay}`;

  useEffect(() => {
    dispatch(budgetActions.fetchBudget(id));
  }, [dispatch, id]);

  let billTotal = 0;
  let paidBills = [];

  for (let i = 0; i < budget?.Bills?.length; i++) {
    const bill = budget.Bills[i];
    if (bill.paid) {
      billTotal += bill.billAmount;
      paidBills.push(bill);
    }
  }
  const handleMarkAsPaid = (billId, newPaidStatus) => {
    const datePaid = new Date(); // Create a new Date object with the current date

    dispatch(billsActions.toggleBillPaidStatus(billId, newPaidStatus, datePaid));
  };

  const openResetModal = () => {
    setResetModal(true);
  };

  const handleResetBills = async (e) => {
    e.preventDefault();

    // Reset the paid bills
    paidBills.forEach((bill) => {
      if (bill.billingDay) {
        handleMarkAsPaid(bill.id, false);
      }

      dispatch(budgetActions.fetchBudget(id));
    });

    setResetModal(false);
  };
  const handleAddBillSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedFormData = {
      ...addFormData,
      isRecurring: isRecurring,
      budgetId: id,
      paid: true,
    };

    setAddFormData({
      billName: "",
      paymentLink: "",
      billingDay: "",
      billingStartMonth: "",
      billingFrequency: "",
      billAmount: "",
      dueDate: "",
      datePaid: "",
      budgetId: "",
      isRecurring: "",
    });

    dispatch(billsActions.addBillBudget(updatedFormData));
    dispatch(budgetActions.fetchBudget(id));
  };

  const addHandleInput = (e) => {
    const { name, value } = e.target;

    if (name === "dueDate") {
      setAddFormData({
        ...addFormData,
        [name]: value,
        datePaid: value,
      });
    } else {
      setAddFormData({
        ...addFormData,
        [name]: value,
      });
    }
  };

  const numberDates = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31,
  ];

  // Filter bills for the current month that have been paid
  const currentMonthPaidBills = budget?.Bills?.filter((bill) => {
    const billDate = new Date(bill.datePaid);
    const timezoneOffsetMinutes = billDate.getTimezoneOffset();

    // Adjust the date by subtracting the offset in minutes
    billDate.setMinutes(billDate.getMinutes() + timezoneOffsetMinutes);

    return (
      bill.paid &&
      billDate.getMonth() + 1 === Number(currentMonth) &&
      billDate.getFullYear() === Number(currentYear)
    );
  });

  return (
    <>
      <div className="budget-detail">
        <div>
          <Menu />
        </div>
        <div className="budget-table">
          <div className="add-bill-container">
            <h2>Add Paid Bill:</h2>
            <form onSubmit={handleAddBillSubmit}>
              <div className="budget-input">
                <label htmlFor="name">Name</label>
                <input
                  className="budget-in"
                  type="text"
                  onChange={addHandleInput}
                  id="name"
                  name="billName"
                  value={addFormData.billName}
                />
                {formErrors.billName && <div className="error-text">{formErrors.billName}</div>}
              </div>
              <div className="budget-input">
                <label>Is it recurring?</label>
                <div>
                  <input
                    type="radio"
                    name="isRecurring"
                    value="true"
                    checked={isRecurring === true}
                    onChange={handleRadioChange}
                  />{" "}
                  Yes
                  <input
                    type="radio"
                    name="isRecurring"
                    value="false"
                    checked={isRecurring === false}
                    onChange={handleRadioChange}
                  />{" "}
                  No
                </div>
                {formErrors.isRecurring && (
                  <div className="error-text">{formErrors.isRecurring}</div>
                )}
              </div>
              {isRecurring && (
                <>
                  <div className="budget-input">
                    <label htmlFor="payment">*Payment Link</label>
                    <input
                      className="budget-in"
                      onChange={addHandleInput}
                      id="payment"
                      name="paymentLink"
                      value={addFormData.paymentLink}
                    />
                    <p className="option">*optional</p>
                  </div>
                  <div className="budget-input">
                    <label>Date Paid:</label>
                    <input
                      className="budget-in"
                      type="date"
                      onChange={addHandleInput}
                      name="dueDate"
                      min={minDate}
                      max={currentDated}
                      value={addFormData.datePaid}
                    />
                    {formErrors.dueDate && <div className="error-text">{formErrors.dueDate}</div>}
                    <input
                      className="budget-in"
                      type="hidden"
                      name="paid"
                      value={(addFormData.paid = true)}
                    />
                  </div>
                </>
              )}

              <div>
                {isRecurring ? (
                  <>
                    <div className="budget-input">
                      <p>Recurs on what date of every month?</p>
                      <label>Date:</label>
                      <select
                        onChange={addHandleInput}
                        name="billingDay"
                        value={addFormData.billingDay}
                      >
                        <option>--</option>
                        {numberDates.map((date, idx) => (
                          <option key={idx}>{date}</option>
                        ))}
                      </select>
                      {formErrors.billingDay && (
                        <div className="error-text">{formErrors.billingDay}</div>
                      )}
                    </div>
                    <input
                      className="budget-in"
                      type="hidden"
                      name="billingDay"
                      value={
                        (addFormData.billingStartMonth = currentDate.toLocaleString("default", {
                          month: "long",
                        }))
                      }
                    />
                    <input
                      className="budget-in"
                      type="hidden"
                      name="billingDay"
                      value={(addFormData.billingFrequency = "every month")}
                    />
                  </>
                ) : (
                  <>
                    <div className="budget-input">
                      <label>Date Paid:</label>
                      <input
                        className="budget-in"
                        type="date"
                        onChange={addHandleInput}
                        name="dueDate"
                        min={minDate}
                        max={currentDated}
                        value={addFormData.dueDate}
                      />
                      {formErrors.dueDate && <div className="error-text">{formErrors.dueDate}</div>}
                      <input
                        className="budget-in"
                        type="hidden"
                        name="paid"
                        value={(addFormData.paid = true)}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="budget-input">
                <label htmlFor="billAMount">Amount</label>
                <input
                  className="budget-in"
                  type="number"
                  onChange={addHandleInput}
                  id="billAmount"
                  name="billAmount"
                  value={addFormData.billAmount}
                  placeholder="200"
                />
                {formErrors.billAmount && <div className="error-text">{formErrors.billAmount}</div>}
              </div>
              <button className="nav-btn bill-btn" type="submit">
                Add Bill
              </button>
            </form>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Date Paid:</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthPaidBills?.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill?.billName}</td>
                  <td>${bill?.billAmount.toFixed(2)}</td>
                  <td>{bill?.datePaid ? bill?.datePaid.slice(0, 10) : bill?.dueDate} </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentMonthPaidBills?.length < 1 ? (
            <p className="not-paid">
              No paid bills at the moment. To add a paid bill, fill out the form above.
            </p>
          ) : null}
          <button
            disabled={currentMonthPaidBills?.length < 1}
            className="nav-btn bill-btn reset-budget-btn recur-btn"
            onClick={openResetModal}
          >
            Reset Recurring Bills
          </button>
        </div>
      </div>

      {resetModal && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleResetBills}>
              <p>Are you sure you want to reset your bills?</p>
              <div className="reset-btns">
                <button onClick={() => setResetModal(false)}>No, Cancel</button>
                <button type="submit">Yes, reset bills</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BudgetDetail;
