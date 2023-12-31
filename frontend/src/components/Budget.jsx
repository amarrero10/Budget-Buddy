import React, { useEffect, useState } from "react";
import "./Budget.css";
import Menu from "./Menu";
import { useDispatch, useSelector } from "react-redux";
import * as budgetActions from "../store/budgets";
import { fetchBills } from "../store/bills";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import BudgetChart from "../budget-charts/BudgetChart";
import BudgetProgressBars from "../budget-charts/BudgetProgressBars";

function Budget() {
  const dispatch = useDispatch();
  const budgets = useSelector((state) => state.budgets.budgets);
  const user = useSelector((state) => state.session.user);
  const bills = useSelector((state) => state.bills.bills);
  const [editBudgetModal, setEditBudgetModal] = useState(false);
  const [deleteBudgetModal, setDeleteBudgetModal] = useState(false);
  const [budgetTotals, setBudgetTotals] = useState({});
  const [currentBudgetId, setCurrentBudgetId] = useState(null);
  const [formData, setFormData] = useState({
    budgetName: "",
    budgetAmount: "",
  });
  const [editFormData, setEditFormData] = useState({
    budgetName: "",
    budgetAmount: "",
  });
  const [formErrors, setFormErrors] = useState({
    budgetName: "",
    budgetAmount: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({
    budgetName: "",
    budgetAmount: "",
  });

  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  const handleCreateBudgetInput = (e) => {
    const { name, value } = e.target;

    if (name === "budgetAmount") {
      setFormData({
        ...formData,
        [name]: value,
        budgetLeft: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleEditBudgetInput = (e) => {
    const { name, value } = e.target;

    // Calculate budgetLeft based on the initial value of editFormData if budgetAmount is not changed
    const newEditFormData = {
      ...editFormData,
      [name]: value,
    };

    if (name === "budgetAmount") {
      newEditFormData.budgetLeft = value;
    } else {
      // Calculate budgetLeft based on the initial budgetAmount value
      newEditFormData.budgetLeft = editFormData.budgetAmount;
    }

    setEditFormData(newEditFormData);
  };

  useEffect(() => {
    const budgetSpent = {};

    for (let i = 0; i < budgets?.length; i++) {
      const budget = budgets[i];
      const billAmounts = [];

      for (let j = 0; j < bills?.length; j++) {
        if (bills[j].budgetId === budget.id && bills[j].paid) {
          const budgetBill = bills[j].billAmount;
          billAmounts.push(budgetBill);
        }
      }

      budgetSpent[budget.id] = billAmounts;
    }

    const newBudgetTotals = {};

    for (const budgetId in budgetSpent) {
      const billAmounts = budgetSpent[budgetId];
      const total = billAmounts.reduce((acc, amount) => acc + amount, 0);
      newBudgetTotals[budgetId] = total;
    }

    setBudgetTotals(newBudgetTotals);
  }, [bills, budgets]);

  useEffect(() => {
    // Fetch bills data when the component mounts
    dispatch(fetchBills());
  }, [dispatch]);

  const validateForm = () => {
    let valid = true;
    const errors = {};

    // Validate budgetName
    if (!formData.budgetName) {
      errors.budgetName = "Budget Name is required.";
      valid = false;
    }

    // Validate budgetAmount
    if (!formData.budgetAmount) {
      errors.budgetAmount = "Budget Amount is required.";
      valid = false;
    } else if (isNaN(formData.budgetAmount) || parseFloat(formData.budgetAmount) <= 0) {
      errors.budgetAmount = "Budget Amount must be a positive number.";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const validateEditForm = () => {
    let valid = true;
    const errors = {};

    // Validate budgetName
    if (!editFormData.budgetName) {
      errors.budgetName = "Budget Name is required.";
      valid = false;
    }

    // Validate budgetAmount
    if (!editFormData.budgetAmount) {
      errors.budgetAmount = "Budget Amount is required.";
      valid = false;
    } else if (isNaN(editFormData.budgetAmount) || parseFloat(editFormData.budgetAmount) <= 0) {
      errors.budgetAmount = "Budget Amount must be a positive number.";
      valid = false;
    }

    setEditFormErrors(errors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(budgetActions.createBudget(formData));

      setFormData({
        budgetName: "",
        budgetAmount: "",
      });
    }
  };

  let totalBudget = 0;

  for (let i = 0; i < budgets.length; i++) {
    const budget = budgets[i];
    totalBudget += budget.budgetAmount;
  }

  const budgetData = budgets.map((budget) => {
    const totalAmount = budget.budgetAmount;
    const spentAmount = budgetTotals[budget.id] || 0;
    const remainingAmount = totalAmount - spentAmount;

    return {
      id: budget.id,
      budgetName: budget.budgetName,
      totalAmount,
      spentAmount,
      remainingAmount,
    };
  });
  const handleEditBudgetModal = (budget) => {
    setEditFormData({
      budgetName: budget.budgetName,
      budgetAmount: budget.budgetAmount,
    });
    setEditBudgetModal(true);
  };

  const handleDeleteBudgetModal = () => {
    setDeleteBudgetModal(true);
  };

  const handleEditBudgetSubmit = (e) => {
    e.preventDefault();

    // Calculate budgetLeft based on the initial budgetAmount value
    if (validateEditForm()) {
      const updatedEditFormData = {
        ...editFormData,
        budgetLeft: editFormData.budgetAmount,
      };

      dispatch(budgetActions.editABudget(currentBudgetId, updatedEditFormData));
      setEditFormData({
        budgetName: "",
        budgetAmount: "",
        budgetLeft: "", // Reset budgetLeft
      });
      setEditBudgetModal(false);
    }
  };

  const handleDeleteBudget = (currentBudgetId) => {
    dispatch(budgetActions.deleteABudget(currentBudgetId));
    setDeleteBudgetModal(false);
  };

  return (
    <>
      <div className="budget-page">
        <div>
          <Menu />
        </div>
        <div className="budget-section">
          <div>
            <h2 className="welcome">Welcome {user.username}!</h2>
            <div className="create-budget-container">
              <div className="budget-card">
                <h2 className="create-budget-title">Create Budget</h2>
                <form onSubmit={handleSubmit}>
                  <div className="input-section">
                    <label htmlFor="budget-name">Budget Name:</label>
                    <input
                      id="budget-name"
                      type="text"
                      placeholder="Credit Cards"
                      name="budgetName"
                      value={formData.budgetName}
                      onChange={handleCreateBudgetInput}
                    ></input>
                    {formErrors.budgetName && <p className="error-text">{formErrors.budgetName}</p>}
                  </div>
                  <div className="input-section">
                    <label htmlFor="budget-amount">What is your total budget?</label>
                    <input
                      id="budget-amount"
                      type="number"
                      placeholder="2500"
                      name="budgetAmount"
                      value={formData.budgetAmount}
                      onChange={handleCreateBudgetInput}
                    ></input>
                    {formErrors.budgetAmount && (
                      <p className="error-text">{formErrors.budgetAmount}</p>
                    )}
                  </div>

                  <button type="submit" className="nav-btn create-btn">
                    Submit
                  </button>
                </form>
              </div>
              <div className="budget-donut">
                <h2> Total Budget Amount: {totalBudget}</h2>
                <BudgetChart data={budgetData} />
              </div>
            </div>
          </div>
          <p className="existing">Existing Budgets:</p>
          <div className="budgets-cards">
            {budgets?.map((budget) => (
              <div className="budgets-card">
                <React.Fragment key={budget.id}>
                  <Link to={`/budgets/${budget.id}`} onClick={() => setSelectedBudgetId(budget.id)}>
                    <BudgetProgressBars data={[budget]} />
                  </Link>
                  <div className="budget-btns">
                    <button
                      className="budget-edit"
                      onClick={() => {
                        setCurrentBudgetId(budget.id);
                        handleEditBudgetModal(budget);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="budget-delete"
                      onClick={() => {
                        setCurrentBudgetId(budget.id);
                        handleDeleteBudgetModal();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </React.Fragment>
              </div>
            ))}
            {budgets.length < 1 && <p>No existing Budgets. Add one above.</p>}
          </div>
        </div>
      </div>
      {editBudgetModal && (
        <>
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleEditBudgetSubmit}>
                <div className="input-div">
                  <input type="hidden" name="budgetId" value={currentBudgetId} />
                  <label htmlFor="change-name">Change Name:</label>
                  <input
                    id="change-name"
                    name="budgetName"
                    value={editFormData.budgetName}
                    type="text"
                    onChange={handleEditBudgetInput}
                  ></input>
                  {editFormErrors.budgetName && (
                    <p className="error-text">{editFormErrors.budgetName}</p>
                  )}
                </div>
                <div className="input-div">
                  <label htmlFor="change-amount">Change Amount:</label>
                  <input
                    id="change-amount"
                    name="budgetAmount"
                    value={editFormData.budgetAmount}
                    type="number"
                    onChange={handleEditBudgetInput}
                  ></input>
                  {editFormErrors.budgetAmount && (
                    <p className="error-text">{editFormErrors.budgetAmount}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    setEditBudgetModal(false);
                    setEditFormErrors({
                      budgetName: "",
                      budgetAmount: "",
                    });
                    e.preventDefault();
                  }}
                >
                  Cancel
                </button>
                <button type="submit">Save Changes</button>
              </form>
            </div>
          </div>
        </>
      )}
      {deleteBudgetModal && (
        <>
          <div className="modal">
            <div className="modal-content">
              <form>
                <input type="hidden" name="budgetId" value={currentBudgetId} />
                <p>
                  Are you sure you want to delete this budget? Doing so will delete all bills
                  associated to this budget.
                </p>
                <div className="modal-btns">
                  <button
                    onClick={(e) => {
                      setDeleteBudgetModal(false);
                      e.preventDefault();
                    }}
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={() => {
                      setDeleteBudgetModal(false);
                      handleDeleteBudget(currentBudgetId); // Pass the callback function
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

export default Budget;
