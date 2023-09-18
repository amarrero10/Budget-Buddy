import { csrfFetch } from "./csrf";

const SET_SAVINGS = "savings/setSavings";

const setSavings = (savings) => ({
  type: SET_SAVINGS,
  payload: savings,
});

export const fetchSavings = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/current/savings-goals");

  if (!res.ok) {
    throw new Error("Failed to fetch savings data");
  }

  const data = await res.json();

  dispatch(setSavings(data.Savings));
};

const initialState = { savings: null };

const savingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SAVINGS:
      return {
        ...state,
        savings: action.payload,
      };
    default:
      return state;
  }
};

export default savingsReducer;
