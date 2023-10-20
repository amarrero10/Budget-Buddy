import { csrfFetch } from "./csrf";

const SET_SAVINGS = "savings/setSavings";
const ADD_SAVINGS = "savings/setSavings";
const REMOVE_USER = "session/removeUser";

const setSavings = (savings) => ({
  type: SET_SAVINGS,
  payload: savings,
});

export const fetchSavings = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/current/savings-goals");

  if (!res.ok) {
    throw new Error("Failed to fetch savings data");
  }

  if (res.ok) {
    const data = await res.json();
    dispatch(setSavings(data.Savings));
    return data;
  }
};

export const addSavings = (formData) => async (dispatch, getState) => {
  const res = await csrfFetch("/api/savings/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  // Fetch the existing savings data from Redux store state
  const existingSavings = getState().savings.savings;

  // Combine the new savings entry with the existing data
  const updatedSavings = [...existingSavings, data.savings];

  dispatch(setSavings(updatedSavings));
};

const initialState = { savings: null };

const savingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SAVINGS:
      return {
        ...state,
        savings: action.payload,
      };
    case ADD_SAVINGS:
      return {
        ...state,
        savings: [...state.savings, action.payload],
      };
    case REMOVE_USER:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default savingsReducer;
