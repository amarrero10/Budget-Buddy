import React, { useEffect, useState } from "react";
import "./Budget.css";
import Menu from "./Menu";
import stringHash from "string-hash";
import { useDispatch, useSelector } from "react-redux";
import * as budgetActions from "../store/budgets";
import { fetchBills } from "../store/bills";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import BudgetChart from "../budget-charts/BudgetChart";
import BudgetProgressBars from "../budget-charts/BudgetProgressBars";

function Budget() {
  const dispatch = useDispatch();
  const budgets = useSelector((state) => state.budgets.budgets);
  const user = useSelector((state) => state.session.user.user);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(budgetActions.createBudget(formData));
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
  };

  const handleDeleteBudget = (currentBudgetId) => {
    dispatch(budgetActions.deleteABudget(currentBudgetId));
    setDeleteBudgetModal(false);
  };

  console.log("NEW BUDGETS", budgets);

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
          </div>
        </div>
      </div>
      {editBudgetModal && (
        <>
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleEditBudgetSubmit}>
                <div>
                  <input type="hidden" name="budgetId" value={currentBudgetId} />
                  <label htmlFor="change-name">Change Name:</label>
                  <input
                    id="change-name"
                    name="budgetName"
                    value={editFormData.budgetName}
                    type="text"
                    onChange={handleEditBudgetInput}
                  ></input>
                </div>
                <div>
                  <label htmlFor="change-amount">Change Amount:</label>
                  <input
                    id="change-amount"
                    name="budgetAmount"
                    value={editFormData.budgetAmount}
                    type="number"
                    onChange={handleEditBudgetInput}
                  ></input>
                </div>
                <button
                  onClick={(e) => {
                    setEditBudgetModal(false);
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
                <button
                  onClick={(e) => {
                    setDeleteBudgetModal(false);
                    e.preventDefault();
                    console.log("ID", currentBudgetId);
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setDeleteBudgetModal(false);
                    handleDeleteBudget(currentBudgetId); // Pass the callback function
                  }}
                >
                  Yes, Delete
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Budget;
