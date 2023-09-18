import { csrfFetch } from "./csrf";

const SET_SAVINGS = "savings/setSavings";
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

const initialState = { savings: null };

const savingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SAVINGS:
      return {
        ...state,
        savings: action.payload,
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
