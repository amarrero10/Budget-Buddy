import { csrfFetch } from "./csrf";

const SET_BUDGETS = "budgets/setBudgets";
const REMOVE_USER = "session/removeUser";

const setBudgets = (budgets) => ({
  type: SET_BUDGETS,
  payload: budgets,
});

export const fetchBudgets = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/current/budgets");

  if (!res.ok) {
    throw new Error("Failed to fetch budgets data");
  }

  const data = await res.json();

  dispatch(setBudgets(data.Budgets));
};

const initialState = { budgets: null };

const budgetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BUDGETS:
      return {
        ...state,
        budgets: action.payload,
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
