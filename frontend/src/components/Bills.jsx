import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as billsActions from "../store/bills";
import Menu from "./Menu";
import "./Bills.css";
import { BsLink, BsPencilSquare, BsTrash3 } from "react-icons/bs";
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
      dueDate = new Date(currentYear + 1, billingStartMonth - 1, billingDay);

      if (dueDate <= currentDate) {
        // Increment the due date by one year
        dueDate.setFullYear(dueDate.getFullYear() + 1);
      }
    } else if (billingFrequency === "quarterly" || billingFrequency === "every quarter") {
      // Calculate quarterly billing date based on billingStartMonth
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const currentDay = currentDate.getDate();

      // Convert billingStartMonth to a numerical value
      const billingStartMonthIndex = months.indexOf(billingStartMonth);

      if (billingStartMonthIndex !== -1) {
        // Add 1 to the index to represent the month (1-based indexing)
        const adjustedBillingMonth = billingStartMonthIndex + 1;

        let nextYear = currentYear;

        if (
          (billingDay >= currentDay && adjustedBillingMonth >= currentMonth + 1) ||
          (billingDay <= currentDay && adjustedBillingMonth >= currentMonth + 1)
        ) {
          dueDate = new Date(nextYear, adjustedBillingMonth + 2, billingDay);
        } else {
          // Billing day and month are in the past, calculate the due date for the same day and month next year
          dueDate = new Date(nextYear + 1, adjustedBillingMonth - 1, billingDay);
        }
      } else {
        // Handle the case when billingStartMonth is not found in the months array
        return null;
      }
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

function Bills() {
  const [editOpenModal, setEditOpenModal] = useState(false);
  const [editOneTimeBillModal, setEditOneTimeBillModal] = useState(false);
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isRecurring, setIsRecurring] = useState(null);
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editOneTimeErrors, setEditOneTimeErrors] = useState({});
  const [deleteBillModal, setDeleteBillModal] = useState(false);
  const [currentBillId, setCurrentBillId] = useState(null);

  const handleRadioChange = (e) => {
    const value = e.target.value === "true"; // Convert the string to a boolean

    setIsRecurring(value); // Update the isRecurring state correctly

    setAddFormData((prevFormData) => ({
      ...prevFormData,
      isRecurring: value, // Update the isRecurring field in the formData
    }));
  };

  const bills = useSelector((state) => state.bills?.bills);
  const bill = useSelector((state) => state.bills?.bill?.billId?.bill);
  const budgets = useSelector((state) => state.budgets?.budgets);
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

  const [oneTimeBillData, setOneTimeBillData] = useState({
    billName: "",
    billAmount: "",
    budgetId: "",
  });

  const [addFormData, setAddFormData] = useState({
    billName: "",
    paymentLink: "",
    billingDay: "",
    billingStartMonth: "",
    billingFrequency: "",
    billAmount: "",
    dueDate: "",
    budgetId: "",
    isRecurring: "",
  });

  const handleEdit = (billId) => {
    setEditOpenModal(true);
    setSelectedBill(billId);
  };

  const handleOneTimeEdit = (billId) => {
    setEditOneTimeBillModal(true);
    setSelectedBill(billId);
  };
  const openAddModal = () => {
    setAddOpenModal(true);
  };

  const openResetModal = () => {
    setResetModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const isValid = validateEditForm();

    if (isValid) {
      setEditOpenModal(false);

      dispatch(billsActions.editABill(selectedBill, formData));
    }
  };

  const handleOneTimeEditSubmit = (e) => {
    e.preventDefault();
    const isValid = validateOneTimeEditForm();
    if (isValid) {
      setEditOneTimeBillModal(false);
      dispatch(billsActions.editABill(selectedBill, oneTimeBillData));
    }
  };

  const handleAddBillSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      setAddOpenModal(false);

      // Check if billAmount doesn't contain a decimal point
      const billAmount = addFormData.billAmount;
      const newValue = billAmount.includes(".") ? billAmount : billAmount + ".00";

      // Update the form data with the formatted billAmount
      const updatedFormData = {
        ...addFormData,
        isRecurring: isRecurring,
        billAmount: newValue, // Updated billAmount
      };

      dispatch(billsActions.addBill(updatedFormData));
      setAddFormData({
        billName: "",
        paymentLink: "",
        billingDay: "",
        billingStartMonth: "",
        billingFrequency: "",
        billAmount: "", // Reset billAmount
        dueDate: "",
        budgetId: "",
        isRecurring: "",
      });
      setIsRecurring(null);
    }
  };

  const handleResetBills = (e) => {
    e.preventDefault();
    recurringBills.forEach((bill) => {
      handleMarkAsPaid(bill.id, false);
    });

    setResetModal(false);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const oneTimeHandleInput = (e) => {
    const { name, value } = e.target;

    setOneTimeBillData({
      ...oneTimeBillData,
      [name]: value,
    });
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

  useEffect(() => {
    if (bill) {
      setOneTimeBillData({
        billName: bill.billName || "",
        billAmount: bill.billAmount || "",
        budgetId: bill.budgetId || "",
      });
    }
  }, [bill]);

  // END EDIT BILL STUFF

  const handleDelete = (billId) => {
    dispatch(billsActions.deleteABill(billId));
    setDeleteBillModal(false);
  };

  const handleDeleteBillModal = () => {
    setDeleteBillModal(true);
  };

  const handleMarkAsPaid = (billId, newPaidStatus) => {
    const datePaid = new Date(); // Create a new Date object with the current date

    dispatch(billsActions.toggleBillPaidStatus(billId, newPaidStatus, datePaid));
  };

  useEffect(() => {}, [bills]);

  // GET ONLY RECURRING BILLS
  let recurringBills = bills?.filter((bill) => bill.billingDay !== null);

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

  const frequency = ["every month", "every quarter", "once a year"];

  // Calculate the current month and year
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth() + 1; // Adding 1 to get 1-based indexing
  const currentYear = currentDate.getFullYear();

  // Calculate the first day of the current month
  const firstDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`;

  // Calculate the last day of the current month
  let currentPaidDate = new Date();

  currentPaidDate.setHours(currentPaidDate.getHours());
  const lastDayOfMonth = currentPaidDate.toISOString().split("T")[0];

  // Filter the one-time bills array to get bills due in the current month
  const oneTimeBillsForCurrentMonth = oneTimeBills.filter((bill) => {
    const datePaid = new Date(bill.datePaid);
    let dueMonth = datePaid.getMonth(); // Get the current month

    // Check if it's the 1st of the month
    if (bill?.datePaid?.includes("01T")) {
      dueMonth += 2;
    } else {
      dueMonth += 1;
    }

    const dueYear = datePaid.getFullYear();

    // Format the date using toLocaleDateString()
    const formattedDate = datePaid.toLocaleDateString();

    // Now you can use `formattedDate` in your code as needed

    return dueMonth === currentMonth && dueYear === currentYear;
  });

  // Sort the bills by due date
  oneTimeBillsForCurrentMonth.sort((a, b) => {
    const dateA = new Date(a.datePaid);
    const dateB = new Date(b.datePaid);
    return dateA - dateB;
  });

  const validateForm = () => {
    const newErrors = {};

    // Perform your validation checks here
    if (!addFormData.billName) {
      newErrors.billName = "Name is required";
    }

    if (addFormData.isRecurring && addFormData.billingDay === "") {
      newErrors.billingDay = "Billing Day is required for recurring bills";
    }

    if (!addFormData.isRecurring && addFormData.dueDate === "") {
      newErrors.dueDate = "Date Paid is required";
    }

    if (!addFormData.billAmount) {
      newErrors.billAmount = "Amount is required";
    } else if (addFormData.billAmount <= 0) {
      newErrors.billAmount = "Amount must be greater than 0";
    }

    if (addFormData.budgetId === "") {
      newErrors.budgetId = "Budget is required";
    }

    if (addFormData.isRecurring === "") {
      newErrors.isRecurring = " Selection is required";
    }

    // Set the errors state
    setErrors(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    // Perform your validation checks here
    if (!formData.billName) {
      newErrors.billName = "Name is required";
    }

    if ((formData.isRecurring && formData.billingDay === "") || formData.billingDay === "--") {
      newErrors.billingDay = "Billing Day is required for recurring bills";
    }

    if (!formData.isRecurring && formData.dueDate === "") {
      newErrors.dueDate = "Date Paid is required";
    }

    if (!formData.billAmount) {
      newErrors.billAmount = "Amount is required";
    } else if (formData.billAmount <= 0) {
      newErrors.billAmount = "Amount must be greater than 0";
    }

    if (formData.budgetId === "" || formData.budgetId === "--") {
      console.log("BUDGET ID", formData.budgetId);
      newErrors.budgetId = "Budget is required";
    }

    if (formData.isRecurring === "") {
      newErrors.isRecurring = " Selection is required";
    }

    // Set the errors state
    setEditErrors(newErrors);

    console.log(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(newErrors).length === 0;
  };

  const validateOneTimeEditForm = () => {
    const newErrors = {};

    // Perform your validation checks here
    if (!oneTimeBillData.billName) {
      newErrors.billName = "Name is required";
    }

    if (!oneTimeBillData.billAmount) {
      newErrors.billAmount = "Amount is required";
    } else if (oneTimeBillData.billAmount <= 0) {
      newErrors.billAmount = "Amount must be greater than 0";
    }

    if (oneTimeBillData.budgetId === "" || oneTimeBillData.budgetId === "--") {
      console.log("BUDGET ID", oneTimeBillData.budgetId);
      newErrors.budgetId = "Budget is required";
    }

    setEditOneTimeErrors(newErrors);

    console.log(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setAddFormData({
      billName: "",
      paymentLink: "",
      billingDay: "",
      billingStartMonth: "",
      billingFrequency: "",
      billAmount: "", // Reset billAmount
      dueDate: "",
      budgetId: "",
      isRecurring: "",
    });
    setIsRecurring(null);
    setErrors({});

    setAddOpenModal(false);
  };

  const handleCancelClick = () => {
    setEditOpenModal(false);
    setEditErrors({});
  };

  return (
    <>
      <div className="bills-page">
        <div>
          <Menu />
        </div>
        {bills.length >= 1 ? (
          <div className="bill-tables">
            <div>
              <p>Monthly Recurring Bills:</p>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th className="table-header">Paid</th>
                    <th className="table-header">Date Paid</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Next Due Date</th>
                    <th className="table-header">Edit</th>
                    <th className="table-header">Delete</th>
                    <th className="table-header">Payment Link</th>
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
                      <td>{bill.paid ? bill.datePaid : "-"}</td>
                      <td>{bill.billName}</td>
                      <td>${Number(bill?.billAmount).toFixed(2)}</td>
                      <td>
                        {bill?.dueDate
                          ? bill.dueDate
                          : calculateDueDate(bill)?.toLocaleDateString()}
                      </td>

                      <td className="edit">
                        <BsPencilSquare onClick={() => handleEdit(bill.id)} className="bill-icon" />
                      </td>
                      <td className="delete">
                        <BsTrash3
                          onClick={() => {
                            setCurrentBillId(bill.id);
                            handleDeleteBillModal();
                          }}
                          className="bill-delete"
                        />
                      </td>
                      <td className="edit">
                        <a href={bill.paymentLink} target="_blank" rel="noreferrer">
                          <BsLink className="bill-icon" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p>Non-Recurring Bills For The Month:</p>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Edit</th>
                    <th className="table-header">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {oneTimeBillsForCurrentMonth?.map((bill) => {
                    return (
                      <tr key={bill.id}>
                        <td>{bill.billName}</td>
                        <td>${Number(bill?.billAmount).toFixed(2)}</td>
                        <td>{bill?.datePaid.slice(0, 10)}</td>
                        <td className="edit">
                          <BsPencilSquare
                            onClick={() => handleOneTimeEdit(bill.id)}
                            className="bill-icon"
                          />
                        </td>
                        <td className="delete">
                          <BsTrash3
                            onClick={() => {
                              setCurrentBillId(bill.id);
                              handleDeleteBillModal();
                            }}
                            className="bill-delete"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bills-btns">
              <button className="nav-btn bill-btn" onClick={openAddModal}>
                Add A Bill
              </button>
              <button className="nav-btn bill-btn recur-btn" onClick={openResetModal}>
                Reset Recurring Bills
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bills-btns">
              {budgets.length < 1 ? (
                <p>Please create a budget to get started.</p>
              ) : (
                <div>
                  <p>No Bills yet. Click the button below to get started! </p>
                  <button className="nav-btn bill-btn" onClick={openAddModal}>
                    Add A Bill
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {editOpenModal && selectedBill && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleEditSubmit}>
              <input type="hidden" name="billId" value={selectedBill} />
              <div className="input-div">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  onChange={handleInput}
                  id="name"
                  name="billName"
                  value={formData.billName}
                ></input>
                {editErrors.billName && <p className="error-text">{editErrors.billName}</p>}
              </div>
              <div className=" input-div">
                <label htmlFor="payment">Payment Link:</label>
                <input
                  onChange={handleInput}
                  id="payment"
                  name="paymentLink"
                  value={formData.paymentLink}
                ></input>
              </div>
              <div>
                <p>Change Date It Falls On:</p>
                <div className="input-div">
                  <label>Date:</label>
                  <select onChange={handleInput} name="billingDay" value={formData.billingDay}>
                    <option>--</option>
                    {numberDates.map((date, idx) => (
                      <option key={idx}>{date}</option>
                    ))}
                  </select>
                  {editErrors.billingDay && <p className="error-text">{editErrors.billingDay}</p>}
                </div>
              </div>
              <input
                type="hidden"
                name="billingDay"
                value={
                  (formData.billingStartMonth = currentDate.toLocaleString("default", {
                    month: "long",
                  }))
                }
              />
              <input
                type="hidden"
                name="billingDay"
                value={(formData.billingFrequency = "every month")}
              />
              <div className="input-div">
                <label htmlFor="billAMount">Amount:</label>
                <input
                  type="number"
                  step="any"
                  onChange={handleInput}
                  id="billAmount"
                  name="billAmount"
                  value={formData.billAmount}
                  placeholder="200"
                ></input>
                {editErrors.billAmount && <p className="error-text">{editErrors.billAmount}</p>}
              </div>
              <div className="input-div">
                <label>Budget:</label>
                <select onChange={handleInput} name="budgetId" value={formData.budgetId}>
                  <option>--</option>
                  {budgets?.map((budget, idx) => (
                    <option key={idx} value={budget.id}>
                      {budget.budgetName}
                    </option>
                  ))}
                </select>
                {editErrors.budgetId && <p className="error-text">{editErrors.budgetId}</p>}
              </div>
              <button type="submit">Save Changes</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {editOneTimeBillModal && selectedBill.dueDate !== null && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleOneTimeEditSubmit}>
              <input type="hidden" name="billId" value={selectedBill} />
              <div className="input-div">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  onChange={oneTimeHandleInput}
                  id="name"
                  name="billName"
                  value={oneTimeBillData.billName}
                ></input>
                {editOneTimeErrors.billName && (
                  <p className="error-text">{editOneTimeErrors.billName}</p>
                )}
              </div>

              <div className="input-div">
                <label htmlFor="billAMount">Amount:</label>
                <input
                  type="number"
                  step="any"
                  onChange={oneTimeHandleInput}
                  id="billAmount"
                  name="billAmount"
                  value={oneTimeBillData.billAmount}
                  placeholder="200"
                ></input>
                {editOneTimeErrors.billAmount && (
                  <p className="error-text">{editOneTimeErrors.billAmount}</p>
                )}
              </div>
              <div className="input-div">
                <label>Budget:</label>
                <select
                  onChange={oneTimeHandleInput}
                  name="budgetId"
                  value={oneTimeBillData.budgetId}
                >
                  <option>--</option>
                  {budgets?.map((budget, idx) => (
                    <option key={idx} value={budget.id}>
                      {budget.budgetName}
                    </option>
                  ))}
                </select>
                {editOneTimeErrors.budgetId && (
                  <p className="error-text">{editOneTimeErrors.budgetId}</p>
                )}
              </div>
              <button type="submit">Save Changes</button>
              <button onClick={() => setEditOneTimeBillModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {addOpenModal && (
        <>
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleAddBillSubmit}>
                <div className=" input-div">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    onChange={addHandleInput}
                    id="name"
                    name="billName"
                    value={addFormData.billName}
                  ></input>
                  {errors.billName && <p className="error-text">{errors.billName}</p>}
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
                  <div>
                    {errors.isRecurring && <p className="error-text">{errors.isRecurring}</p>}
                  </div>
                </div>
                {isRecurring && (
                  <div className=" input-div">
                    <label htmlFor="payment">*Payment Link:</label>
                    <input
                      onChange={addHandleInput}
                      id="payment"
                      name="paymentLink"
                      value={addFormData.paymentLink}
                    ></input>
                    <p className="optional">*optional</p>
                  </div>
                )}

                <div>
                  {isRecurring ? (
                    <>
                      <p>Next Due Date:</p>
                      <div className="input-div">
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
                        {errors.billingDay && <p className="error-text">{errors.billingDay}</p>}
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
                      <div className=" input-div">
                        <label>Date Paid:</label>
                        <input
                          type="date"
                          onChange={addHandleInput}
                          name="dueDate"
                          min={firstDayOfMonth}
                          max={lastDayOfMonth}
                          value={addFormData.dueDate}
                        ></input>
                        {errors.dueDate && <p className="error-text">{errors.dueDate}</p>}
                        <input type="hidden" name="paid" value={(addFormData.paid = true)} />
                      </div>
                    </>
                  )}
                </div>
                <div className=" input-div">
                  <label htmlFor="billAmount">Amount:</label>
                  <input
                    type="number"
                    step="any"
                    onChange={addHandleInput}
                    id="billAmount"
                    name="billAmount"
                    value={addFormData.billAmount}
                    placeholder="200"
                  ></input>
                  {errors.billAmount && <p className="error-text">{errors.billAmount}</p>}
                </div>
                <div className="input-div">
                  <label>Budget:</label>
                  <select onChange={addHandleInput} name="budgetId" value={addFormData.budgetId}>
                    <option>--</option>
                    {budgets?.map((budget, idx) => (
                      <option key={idx} value={budget.id}>
                        {budget.budgetName}
                      </option>
                    ))}
                  </select>
                  {errors.budgetId && <p className="error-text">{errors.budgetId}</p>}
                </div>
                <button type="submit">Add Bill</button>
                <button onClick={handleCancel}>Cancel</button>
              </form>
            </div>
          </div>
        </>
      )}

      {resetModal && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleResetBills}>
              <p>Are you sure you want to reset your recurring bills?</p>
              <div className="reset-btns">
                <button onClick={() => setResetModal(false)}>No, Cancel</button>
                <button type="submit">Yes, reset bills</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteBillModal && (
        <>
          <div className="modal">
            <div className="modal-content">
              <form>
                <input type="hidden" name="budgetId" value={currentBillId} />
                <p className=" delete-bill">Are you sure you want to delete this bill?</p>
                <div className="modal-btns">
                  <button
                    onClick={(e) => {
                      setDeleteBillModal(false);
                      e.preventDefault();
                    }}
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={() => {
                      setDeleteBillModal(false);
                      handleDelete(currentBillId); // Pass the callback function
                    }}
                  >
                    Yes, Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Bills;
