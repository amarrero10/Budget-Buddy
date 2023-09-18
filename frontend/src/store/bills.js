import { csrfFetch } from "./csrf";

const SET_BILLS = "bills/setBills";

const setBills = (bills) => ({
  type: SET_BILLS,
  payload: bills,
});

export const fetchBills = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/current/bills");

  if (!res.ok) {
    throw new Error("Failed to fetch bills data");
  }

  const data = await res.json();

  dispatch(setBills(data.Bills));
};

const initialState = { bills: null };

const billsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BILLS:
      return {
        ...state,
        bills: action.payload,
      };
    default:
      return state;
  }
};

export default billsReducer;
