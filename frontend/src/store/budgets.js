import { fetchBills } from "./bills";
import { csrfFetch } from "./csrf";

const SET_BUDGETS = "budgets/setBudgets";
const SET_BUDGET = "budgets/setBudget";
const EDIT_A_BUDGET = "budgets/editBudget";
const DELETE_BUDGET = "budgets/deleteBudget";
const REMOVE_USER = "session/removeUser";

const setBudgets = (budgets) => ({
  type: SET_BUDGETS,
  payload: budgets,
});

const setBudget = (budget) => ({
  type: SET_BUDGET,
  payload: budget,
});

const editBudget = (budgetId, editedBudget) => ({
  type: EDIT_A_BUDGET,
  payload: { budgetId, editedBudget },
});

const deleteBudget = (budgetId) => ({
  type: DELETE_BUDGET,
  payload: budgetId,
});

export const fetchBudgets = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/current/budgets");

  if (!res.ok) {
    throw new Error("Failed to fetch budgets data");
  }

  const data = await res.json();

  dispatch(setBudgets(data.Budgets));
};

export const fetchBudget = (budgetId) => async (dispatch) => {
  const res = await csrfFetch(`/api/budgets/${budgetId}`);
  const data = await res.json();

  dispatch(setBudget(data.budget));
};

export const createBudget = (formData) => async (dispatch) => {
  const res = await csrfFetch("/api/budgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  dispatch(setBudget(data));
  dispatch(fetchBudgets());
};

export const editABudget = (budgetId, formData) => async (dispatch, getState) => {
  const state = getState();
  const budget = state.budgets.budgets.find((budget) => (budget.id = budgetId));

  if (!budget) return;

  const res = await csrfFetch(`/api/budgets/${budgetId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to edit budget");

  dispatch(editBudget(budgetId, formData));
  dispatch(fetchBudgets());
};

export const deleteABudget = (budgetId) => async (dispatch, getState) => {
  const state = getState();
  const budget = state.budgets.budgets.find((budget) => budget.id === budgetId);
  const res = await csrfFetch(`/api/budgets/${budgetId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteBudget(budgetId));
    dispatch(fetchBudgets());
    dispatch(fetchBills());
  }
};

const initialState = { budgets: [] };

const budgetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BUDGETS:
      return {
        ...state,
        budgets: action.payload,
      };
    case SET_BUDGET:
      return {
        ...state,
        budget: action.payload,
      };
    case REMOVE_USER:
      return initialState; // Reset state when the user is removed
    case EDIT_A_BUDGET:
      const { budgetId, editedBudget } = action.payload;
      const budgetIndex = state.budgets.findIndex((budget) => budget.id === budgetId);

      if (budgetIndex !== -1) {
        const updatedBudgets = [...state.budgets];
        updatedBudgets[budgetIndex] = {
          ...updatedBudgets[budgetIndex],
          ...editedBudget,
        };

        return {
          ...state,
          budgets: updatedBudgets,
        };
      }

      return state;
    case DELETE_BUDGET:
      const updatedBudgets = state.budgets.filter((budget) => budget.id !== action.payload);

      return {
        ...state,
        budgets: updatedBudgets,
      };
    default:
      return state;
  }
};

export default budgetsReducer;
