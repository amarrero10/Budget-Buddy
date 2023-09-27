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

    const updatedFormData = { ...addFormData, isRecurring: isRecurring, budgetId: id, paid: true };

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
  return (
    <>
      <div className="budget-detail">
        <div>
          <Menu />
        </div>
        <div className="budget-table">
          <table className="custom-table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Date Paid:</th>
              </tr>
            </thead>
            <tbody>
              {paidBills?.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill?.billName}</td>
                  <td>{bill?.billAmount}</td>
                  <td>{bill?.datePaid ? bill?.datePaid : bill?.dueDate} </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="nav-btn bill-btn" onClick={openResetModal}>
            Reset Monthly Bills
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
      <>
        <div>
          <div>
            <form onSubmit={handleAddBillSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  onChange={addHandleInput}
                  id="name"
                  name="billName"
                  value={addFormData.billName}
                />
              </div>
              <div>
                <label>Is it recurring?</label>
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
              {isRecurring && (
                <>
                  <div>
                    <label htmlFor="payment">Payment Link</label>
                    <input
                      onChange={addHandleInput}
                      id="payment"
                      name="paymentLink"
                      value={addFormData.paymentLink}
                    />
                  </div>
                  <div>
                    <label>Date Paid:</label>
                    <input
                      type="date"
                      onChange={addHandleInput}
                      name="dueDate"
                      min={minDate}
                      max={currentDated}
                      value={addFormData.datePaid}
                    />
                    <input type="hidden" name="paid" value={(addFormData.paid = true)} />
                  </div>
                </>
              )}

              <div>
                {isRecurring ? (
                  <>
                    <div>
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
                    </div>
                    <input
                      type="hidden"
                      name="billingDay"
                      value={
                        (addFormData.billingStartMonth = currentDate.toLocaleString("default", {
                          month: "long",
                        }))
                      }
                    />
                    <input
                      type="hidden"
                      name="billingDay"
                      value={(addFormData.billingFrequency = "every month")}
                    />
                  </>
                ) : (
                  <>
                    <label>Date Paid:</label>
                    <input
                      type="date"
                      onChange={addHandleInput}
                      name="dueDate"
                      min={minDate}
                      max={currentDated}
                      value={addFormData.dueDate}
                    />
                    <input type="hidden" name="paid" value={(addFormData.paid = true)} />
                  </>
                )}
              </div>
              <div>
                <label htmlFor="billAMount">Amount</label>
                <input
                  type="number"
                  onChange={addHandleInput}
                  id="billAmount"
                  name="billAmount"
                  value={addFormData.billAmount}
                  placeholder="200"
                />
              </div>
              <div>
                <label>Budget</label>
              </div>
              <button type="submit">Add Bill</button>
            </form>
          </div>
        </div>
      </>
    </>
  );
}

export default BudgetDetail;
