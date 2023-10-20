import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import "./Savings.css";
import * as savingsActions from "../store/savings";
import { GoLog } from "react-icons/go";

function Savings() {
  const dispatch = useDispatch();
  const savings = useSelector((state) => state.savings?.savings);
  const user = useSelector((state) => state.session.user.user);
  const [createSavingsModal, setCreateSavingsModal] = useState(false);
  const [createSavingsForm, setCreateSavingsForm] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "",
  });

  const openCreateSavingsModal = (e) => {
    e.preventDefault();
    setCreateSavingsModal(!createSavingsModal);
  };

  const handleCloseCreateModal = (e) => {
    e.preventDefault();
    setCreateSavingsModal(false);
  };

  useEffect(() => {
    dispatch(savingsActions.fetchSavings());
  }, [dispatch]);

  const handleCreateSavingsInput = (e) => {
    const { name, value } = e.target;

    setCreateSavingsForm({
      ...createSavingsForm,
      [name]: value,
    });
  };

  const handleCreateSavings = (e) => {
    e.preventDefault();
    console.log(createSavingsForm);
    dispatch(savingsActions.addSavings(createSavingsForm));
    setCreateSavingsModal(false);
    setCreateSavingsForm({
      goalName: "",
      targetAmount: "",
      currentAmount: "",
    });
  };

  console.log(createSavingsModal);

  console.log("SAVINGS", savings);
  return (
    <>
      <div className="savings-page">
        <div>
          <Menu />
        </div>
        <div>
          <p>Welcome to your savings page, {user.username}!</p>
          <div className="savings-card-container">
            {savings ? (
              savings.map((saving) => (
                <div className=" savings-card">
                  <div className="savings-info-and-btns">
                    <div className="savings-info">
                      <p className="saving-name">{saving.goalName}</p>
                      <p>
                        <span className="saving-amounts">Target: </span> ${saving.targetAmount}
                      </p>
                      <p>
                        <span className="saving-amounts">Current: </span> ${saving.currentAmount}
                      </p>
                    </div>
                    <div className="savings-btns">
                      <button className="nav-btn">Edit</button>
                      <button className="nav-btn">Delete</button>
                      <button className="nav-btn">Contribute</button>
                    </div>
                  </div>
                  <p>PROGRESS BAR</p>
                </div>
              ))
            ) : (
              <p>Loading savings data...</p>
            )}
          </div>
          <button className="nav-btn add-saving" onClick={openCreateSavingsModal}>
            Add a savings goal
          </button>
        </div>
      </div>

      {createSavingsModal && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleCreateSavings}>
              <div className=" budget-input">
                <label htmlFor="savings-name">Savings Goal Name</label>
                <input
                  className="budget-in"
                  id="savings-name"
                  name="goalName"
                  onChange={handleCreateSavingsInput}
                  value={createSavingsForm.goalName}
                ></input>
              </div>
              <div className=" budget-input">
                <label htmlFor="savings-target">Savings Target Amount</label>
                <input
                  className="budget-in"
                  id="savings-target"
                  name="targetAmount"
                  onChange={handleCreateSavingsInput}
                  value={createSavingsForm.targetAmount}
                ></input>
              </div>
              <div className=" budget-input">
                <label htmlFor="savings-current">Current Amount</label>
                <input
                  className="budget-in"
                  id="savings-current"
                  name="currentAmount"
                  onChange={handleCreateSavingsInput}
                  value={createSavingsForm.currentAmount}
                ></input>
              </div>
              <button onClick={handleCloseCreateModal}>Cancel</button>
              <button type="submit">Create Savings</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Savings;
