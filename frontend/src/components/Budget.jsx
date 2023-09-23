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
  const [budgetTotals, setBudgetTotals] = useState({});
  const [formData, setFormData] = useState({
    budgetName: "",
    budgetAmount: "",
    budgetDay: "",
    budgetStartMonth: "",
    budgetFrequency: "",
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

  const frequency = ["every month", "every quarter", "once a year"];

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
                  <div>
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
                  <div>
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
                  <p>When do you want this to reset?</p>
                  <div>
                    <label htmlFor="budget-date">Budget Date Number:</label>
                    <select
                      id="budget-date"
                      type="number"
                      placeholder="2500"
                      name="budgetDay"
                      value={formData.budgetDay}
                      onChange={handleCreateBudgetInput}
                    >
                      <option>--</option>
                      {numberDates.map((number, idx) => (
                        <option key={idx}>{number}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget-month">Budget Start Month:</label>
                    <select
                      id="budget-month"
                      type="number"
                      placeholder="2500"
                      name="budgetStartMonth"
                      value={formData.budgetStartMonth}
                      onChange={handleCreateBudgetInput}
                    >
                      <option>--</option>
                      {months.map((month, idx) => (
                        <option key={idx}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget-frequency">Frequency:</label>
                    <select
                      id="budget-frequency"
                      type="number"
                      placeholder="2500"
                      name="budgetFrequency"
                      value={formData.budgetFrequency}
                      onChange={handleCreateBudgetInput}
                    >
                      <option>--</option>
                      {frequency.map((often, idx) => (
                        <option key={idx}>{often}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
              <div className="budget-donut">
                <h2> Total Budget Amount: {totalBudget}</h2>
                <BudgetChart data={budgetData} />
              </div>
            </div>
          </div>
          <p className="existing">Existing Budgets:</p>

          {budgets?.map((budget) => (
            <div className="budgets-card">
              <React.Fragment key={budget.id}>
                <Link to={`/budgets/${budget.id}`} onClick={() => setSelectedBudgetId(budget.id)}>
                  <BudgetProgressBars data={[budget]} />
                </Link>
                <div className="budget-btns">
                  <button className="budget-edit">Edit</button>
                  <button className="budget-delete">Delete</button>
                </div>
              </React.Fragment>
            </div>
          ))}

          {/* <Link to={`/budgets/${budget.id}`}>
              <BudgetProgressBars data={budgetData} />
            </Link> */}
        </div>
      </div>
    </>
  );
}

// {
//   /* <div className="budget-card-container">
//   {budgets?.map((budget, idx) => (
//     <Link to={`/budgets/${budget.id}`} key={idx}>
//       <div className="budget-card">
//         <div>
//           <h2>{budget.budgetName}</h2>
//           <p>{budget.budgetAmount} budgeted</p>
//         </div>
//         <div>
//           <p>Progress Bar goes here</p>
//         </div>
//         <div>
//           <p>Money Spent: {budgetTotals[budget.id]}</p>
//           <p>{budget.budgetLeft - budgetTotals[budget.id]} remaining</p>
//         </div>
//         <div className="budget-card-btns">
//           <button>Edit</button>
//           <button>Delete</button>
//         </div>
//       </div>
//     </Link>
//   ))}
// </div> */
// }

export default Budget;
