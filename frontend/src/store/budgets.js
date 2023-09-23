import { csrfFetch } from "./csrf";

const SET_BUDGETS = "budgets/setBudgets";
const SET_BUDGET = "budgets/setBudget";
const REMOVE_USER = "session/removeUser";

const setBudgets = (budgets) => ({
  type: SET_BUDGETS,
  payload: budgets,
});

const setBudget = (budget) => ({
  type: SET_BUDGET,
  payload: budget,
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

  console.log("BUDGET DATA", data);
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

const initialState = { budgets: null };

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
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default budgetsReducer;
