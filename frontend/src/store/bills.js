import { csrfFetch } from "./csrf";

const SET_BILLS = "bills/setBills";
const MARK_BILL_AS_PAID = "bills/markBillAsPaid";
const REMOVE_USER = "session/removeUser";

const setBills = (bills) => ({
  type: SET_BILLS,
  payload: bills,
});

const markBillAsPaid = (billId) => ({
  type: MARK_BILL_AS_PAID,
  payload: { billId },
});

export const fetchBills = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/current/bills");

  if (!res.ok) {
    throw new Error("Failed to fetch bills data");
  }

  const data = await res.json();

  dispatch(setBills(data.Bills));
};

export const toggleBillPaidStatus = (billId, newPaidStatus) => async (dispatch, getState) => {
  const state = getState();
  const bill = state.bills.bills.find((bill) => bill.id === billId);

  if (!bill) {
    return;
  }

  const res = await csrfFetch(`/api/bills/${billId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paid: newPaidStatus }),
  });

  if (!res.ok) {
    throw new Error("Failed to update bill status");
  }

  dispatch(markBillAsPaid(billId, newPaidStatus));
  dispatch(fetchBills());
};

const initialState = { bills: null };

const billsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BILLS:
      return {
        ...state,
        bills: action.payload,
      };
    case MARK_BILL_AS_PAID:
      return {
        ...state,
        bills: state.bills.map((bill) =>
          bill.id === action.payload.billId ? { ...bill, paid: action.payload.newPaidStatus } : bill
        ),
      };
    case REMOVE_USER:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default billsReducer;
