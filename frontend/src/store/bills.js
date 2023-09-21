import { csrfFetch } from "./csrf";

const SET_BILLS = "bills/setBills";
const SET_BILL = "bills/setBill";
const MARK_BILL_AS_PAID = "bills/markBillAsPaid";
const EDIT_A_BILL = "bills/editBill";
const REMOVE_USER = "session/removeUser";

const setBills = (bills) => ({
  type: SET_BILLS,
  payload: bills,
});

const setBill = (billId) => ({
  type: SET_BILL,
  payload: { billId },
});

const markBillAsPaid = (billId) => ({
  type: MARK_BILL_AS_PAID,
  payload: { billId },
});

const editBill = (billId, editedBill) => ({
  type: EDIT_A_BILL,
  payload: { billId, editedBill },
});

export const fetchBills = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/current/bills");

  if (!res.ok) {
    throw new Error("Failed to fetch bills data");
  }

  const data = await res.json();

  dispatch(setBills(data.Bills));
};

export const fetchBill = (billId) => async (dispatch) => {
  const res = await csrfFetch(`/api/bills/${billId}`);

  const data = await res.json();

  dispatch(setBill(data));

  console.log("BILL", data.bill);
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

export const editABill = (billId, formData) => async (dispatch, getState) => {
  const state = getState();
  console.log("editABill action called"); // Add this line
  const bill = state.bills.bills.find((bill) => bill.id === billId);

  if (!bill) {
    return;
  }

  const res = await csrfFetch(`/api/bills/update-bill/${billId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error("Failed to update the bill");
  }

  console.log("FORMDATA", formData);
  dispatch(editBill(billId, formData));
  // dispatch(fetchBills());
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
    case SET_BILL:
      return {
        ...state,
        bill: action.payload,
      };
    case EDIT_A_BILL:
      const { billId, editedBill } = action.payload;

      // Find the index of the bill to update
      const billIndex = state.bills.findIndex((bill) => bill.id === billId);

      if (billIndex !== -1) {
        // Clone the bills array to create a new state object
        const updatedBills = [...state.bills];

        // Update the bill at the specified index with the edited data
        updatedBills[billIndex] = {
          ...updatedBills[billIndex],
          ...editedBill,
        };

        // Return the updated state object
        return {
          ...state,
          bills: updatedBills,
        };
      }

      return state; // Return the current state if the bill was not found

    case REMOVE_USER:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default billsReducer;
