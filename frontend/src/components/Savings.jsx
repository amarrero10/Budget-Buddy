import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import "./Savings.css";
import * as savingsActions from "../store/savings";

function Savings() {
  const dispatch = useDispatch();
  const savings = useSelector((state) => state.savings?.savings);
  const user = useSelector((state) => state.session.user.user);
  const [createSavingsModal, setCreateSavingsModal] = useState(false);
  const [deleteSavingsModal, setDeleteSavingsModal] = useState(false);
  const [editSavingsModal, setEditSavingsModal] = useState(false);
  const [contributeModal, setContributeModal] = useState(false);
  const [savingsId, setSavingsId] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [savingsErrors, setSavingsErrors] = useState({});
  const [editSavingsErrors, setEditSavingsErrors] = useState({});
  const [contributeErrors, setContributeErrors] = useState({});

  const [createSavingsForm, setCreateSavingsForm] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "",
  });
  const [editSavingsForm, setEditSavingsForm] = useState({});
  const [contributeForm, setContributeForm] = useState({});

  const openCreateSavingsModal = (e) => {
    e.preventDefault();
    setCreateSavingsModal(true);
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

    const isValid = validateForm();

    if (isValid) {
      dispatch(savingsActions.addSavings(createSavingsForm));
      setCreateSavingsModal(false);
      setCreateSavingsForm({
        goalName: "",
        targetAmount: "",
        currentAmount: "",
      });
    }
  };

  const handleDeleteSavingsModal = (savingsId) => {
    setDeleteSavingsModal(true);
    setSavingsId(savingsId);
  };

  const handleCloseDeleteModal = () => {
    setDeleteSavingsModal(false);
  };

  const handleDeleteSavings = () => {
    dispatch(savingsActions.deleteASavings(savingsId));
    setDeleteSavingsModal(false);
  };

  const handleEditSavingsModal = async (savingsId) => {
    setEditSavingsModal(true);
    setSavingsId(savingsId);
    const res = await fetch(`/api/savings/${savingsId}`);
    const data = await res.json();
    setEditSavingsForm({
      goalName: data.savings.goalName || "",
      targetAmount: data.savings.targetAmount || "",
      currentAmount: data.savings.currentAmount >= 0 ? Number(data.savings.currentAmount) : "",
    });
  };

  const handleEditSavings = (e) => {
    e.preventDefault();
    const isValid = validateEditForm();

    if (isValid) {
      dispatch(savingsActions.editASavings(savingsId, editSavingsForm));
      setEditSavingsModal(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditSavingsModal(false);
  };

  const handleEditSavingsInput = (e) => {
    const { name, value } = e.target;

    setEditSavingsForm({
      ...editSavingsForm,
      [name]: value,
    });
  };

  const handleContributeModal = async (savingsId) => {
    setContributeModal(true);
    setSavingsId(savingsId);
    const res = await fetch(`/api/savings/${savingsId}`);
    const data = await res.json();
    setContributeForm({
      goalName: data.savings.goalName || "",
      targetAmount: data.savings.targetAmount || "",
      currentAmount: data.savings.currentAmount >= 0 ? Number(data.savings.currentAmount) : "",
    });
    setCurrentAmount(data.savings.currentAmount);
  };

  const handleCloseContributeModal = () => {
    setContributeModal(false);
  };

  const handleContributeSavingsInput = (e) => {
    const { name, value } = e.target;

    setContributeForm({
      ...contributeForm,
      [name]: value,
    });
  };

  const handleContributeSavings = (e) => {
    e.preventDefault();
    const isValid = validateContributeForm();

    if (isValid) {
      contributeForm.currentAmount = Number(currentAmount) + Number(contributeForm.currentAmount);
      dispatch(savingsActions.contributeToSavings(savingsId, contributeForm));

      setContributeModal(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!createSavingsForm.goalName) {
      newErrors.goalName = "A name for yours savings is required.";
    }

    if (!createSavingsForm.targetAmount) {
      newErrors.targetAmount = "Target Amount is required.";
    } else if (Number(createSavingsForm.targetAmount) <= 0) {
      newErrors.targetAmount = "Target Amount must be a positive number.";
    }

    if (!createSavingsForm.currentAmount) {
      newErrors.currentAmount = "Current Amount is required.";
    } else if (Number(createSavingsForm.targetAmount) <= Number(createSavingsForm.currentAmount)) {
      newErrors.currentAmount = " Current Amount must be less than Target Amount";
    } else if (Number(createSavingsForm.currentAmount) <= 0) {
      newErrors.currentAmount = "Current Amount must be a positive number.";
    }

    setSavingsErrors(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editSavingsForm.goalName) {
      newErrors.goalName = "A name for yours savings is required.";
    }

    if (!editSavingsForm.targetAmount) {
      newErrors.targetAmount = "Target Amount is required.";
    } else if (Number(editSavingsForm.targetAmount) <= 0) {
      newErrors.targetAmount = "Target Amount must be a positive number.";
    }

    if (!editSavingsForm.currentAmount) {
      newErrors.currentAmount = "Current Amount is required.";
    } else if (Number(editSavingsForm.targetAmount) <= Number(createSavingsForm.currentAmount)) {
      newErrors.currentAmount = " Current Amount must be less than Target Amount";
    } else if (Number(editSavingsForm.currentAmount) <= 0) {
      newErrors.currentAmount = "Current Amount must be a positive number.";
    }

    setEditSavingsErrors(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(newErrors).length === 0;
  };

  const validateContributeForm = () => {
    const newErrors = {};

    if (!contributeForm.currentAmount) {
      newErrors.currentAmount = "Amount is required ";
    } else if (Number(contributeForm.currentAmount) <= 0) {
      newErrors.currentAmount = "Amount must be a positive number.";
    }

    setContributeErrors(newErrors);

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(newErrors).length === 0;
  };

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
                <div key={saving.id} className=" savings-card pad">
                  {/* {(saving.currentAmount / saving.targetAmount) * 100 >= 100 && (
                    <div className="goal">
                      <p> Great Job, you reached your goal! 🎉🎉</p>
                    </div>
                  )} */}
                  <div
                    className={`savings-info-and-btns ${
                      (saving.currentAmount / saving.targetAmount) * 100 >= 100 ? "green" : ""
                    }`}
                  >
                    <div className="savings-info">
                      <p className="saving-name">{saving.goalName}</p>
                      <p>
                        <span className="saving-amounts">Target: </span> ${saving.targetAmount}
                      </p>
                      <p>
                        <span className="saving-amounts">Current: </span> ${saving.currentAmount}
                      </p>
                    </div>
                  </div>
                  <div className="budget-progress-container ">
                    {(saving.currentAmount / saving.targetAmount) * 100 <= 100 ? (
                      <div
                        className=" budget-progress"
                        style={{ width: `${(saving.currentAmount / saving.targetAmount) * 100}%` }}
                      ></div>
                    ) : (
                      <div
                        className="budget-progress "
                        style={{
                          width: `100%`,
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="percent">
                    {saving.currentAmount / saving.targetAmount === 0
                      ? "0%"
                      : `${((saving.currentAmount / saving.targetAmount) * 100).toFixed(2)}%`}
                  </div>
                  <div className="savings-btns">
                    <button className="nav-btn" onClick={() => handleEditSavingsModal(saving.id)}>
                      Edit
                    </button>
                    <button className="nav-btn" onClick={() => handleDeleteSavingsModal(saving.id)}>
                      Delete
                    </button>
                    <button className="nav-btn" onClick={() => handleContributeModal(saving.id)}>
                      Contribute
                    </button>
                  </div>
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
                <p className="error-text">{savingsErrors.goalName}</p>
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
                <p className="error-text">{savingsErrors.targetAmount}</p>
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
                <p className="error-text">{savingsErrors.currentAmount}</p>
              </div>
              <button onClick={handleCloseCreateModal}>Cancel</button>
              <button type="submit">Create Savings</button>
            </form>
          </div>
        </div>
      )}

      {deleteSavingsModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this goal?</p>
            <button onClick={handleCloseDeleteModal}>No, Cancel</button>
            <button onClick={handleDeleteSavings}>Yes, Delete</button>
          </div>
        </div>
      )}

      {editSavingsModal && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleEditSavings}>
              <div className=" budget-input">
                <label htmlFor="savings-name">Savings Goal Name</label>
                <input
                  className="budget-in"
                  id="savings-name"
                  name="goalName"
                  onChange={handleEditSavingsInput}
                  value={editSavingsForm.goalName}
                ></input>
                <p className="error-text">{editSavingsErrors.goalName}</p>
              </div>
              <div className=" budget-input">
                <label htmlFor="savings-target">Savings Target Amount</label>
                <input
                  className="budget-in"
                  id="savings-target"
                  name="targetAmount"
                  onChange={handleEditSavingsInput}
                  value={editSavingsForm.targetAmount}
                ></input>
                <p className="error-text">{editSavingsErrors.targetAmount}</p>
              </div>
              <div className=" budget-input">
                <label htmlFor="savings-current">Current Amount</label>
                <input
                  className="budget-in"
                  id="savings-current"
                  name="currentAmount"
                  onChange={handleEditSavingsInput}
                  value={editSavingsForm.currentAmount}
                ></input>
                <p className="error-text">{editSavingsErrors.currentAmount}</p>
              </div>
              <button onClick={handleCloseEditModal}>Cancel</button>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {contributeModal && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleContributeSavings}>
              <div className=" budget-input">
                <label htmlFor="savings-current">Current Amount</label>
                <input
                  className="budget-in"
                  id="savings-current"
                  disabled
                  value={currentAmount}
                ></input>
              </div>
              <div className=" budget-input">
                <label htmlFor="savings-contribute">How much do you want to contribute?</label>
                <input
                  className="budget-in"
                  id="savings-contribute"
                  name="currentAmount"
                  onChange={handleContributeSavingsInput}
                  value={contributeForm.currentAmount}
                ></input>
                <p className="error-text">{contributeErrors.currentAmount}</p>
              </div>
              <button onClick={handleCloseContributeModal}>Cancel</button>
              <button type="submit">Make Contribution</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Savings;
