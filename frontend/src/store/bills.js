import { fetchBudgets } from "./budgets";
import { csrfFetch } from "./csrf";

const SET_BILLS = "bills/setBills";
const SET_BILL = "bills/setBill";
const MARK_BILL_AS_PAID = "bills/markBillAsPaid";
const EDIT_A_BILL = "bills/editBill";
const REMOVE_USER = "session/removeUser";
const DELETE_BILL = "bills/deleteABill";

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

const deleteBill = (billId) => ({
  type: DELETE_BILL,
  payload: billId,
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

export const toggleBillPaidStatus =
  (billId, newPaidStatus, datePaid) => async (dispatch, getState) => {
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
      body: JSON.stringify({ paid: newPaidStatus, datePaid }),
    });

    if (!res.ok) {
      throw new Error("Failed to update bill status");
    }

    dispatch(markBillAsPaid(billId, newPaidStatus, datePaid));
    dispatch(fetchBills());
    dispatch(fetchBudgets());
  };

export const addBill = (formData) => async (dispatch) => {
  console.log("addBill form data", formData);
  // Check if the bill is recurring
  const isRecurring = formData.isRecurring === true;

  console.log("IS RECUR", isRecurring);

  // Create a formData object with the common fields
  const commonData = {
    billName: formData.billName,
    paymentLink: formData.paymentLink,
    billAmount: formData.billAmount,
    budgetId: formData.budgetId,
  };

  const finalFormData = isRecurring
    ? {
        ...commonData,
        billingDay: formData.billingDay,
        billingStartMonth: formData.billingStartMonth,
        billingFrequency: formData.billingFrequency,
        paid: false, // Set to false for recurring bills
        dueDate: formData.dueDate,
      }
    : {
        ...commonData,
        dueDate: formData.dueDate,
        datePaid: formData.datePaid,
        paid: true, // Set to true for one-time bills
      };

  console.log("FINAL FORM ", finalFormData);

  const res = await csrfFetch(`/api/bills/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalFormData),
  });

  if (!res.ok) {
    throw new Error("Failed to add a new bill");
  }

  const data = await res.json();

  dispatch(setBill(data.id));
  dispatch(fetchBills());
  dispatch(fetchBudgets());
};

export const editABill = (billId, formData) => async (dispatch, getState) => {
  const state = getState();
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

  console.log("FORM DATA", formData);

  if (!res.ok) {
    throw new Error("Failed to update the bill");
  }

  dispatch(editBill(billId, formData));
  dispatch(fetchBills());
  dispatch(fetchBudgets());
};

export const deleteABill = (billId) => async (dispatch, getState) => {
  const state = getState();
  const bill = state.bills.bills.find((bill) => bill.id === billId);

  if (!bill) {
    console.error("Bill not found in state.");
    return;
  }

  console.log("THUNK BILLID", billId);
  console.log("THUNK BILL", bill);

  try {
    const res = await csrfFetch(`/api/bills/${billId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      dispatch(deleteBill(billId));
    } else {
      console.error("Failed to delete the bill. Status code:", res.status);
      // You can dispatch an action to handle the error or show a user-friendly message here
    }
  } catch (error) {
    console.error("An error occurred while deleting the bill:", error);
    // Handle the error (e.g., dispatch an action to show an error message)
  }
  dispatch(fetchBills());
  dispatch(fetchBudgets());
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
          bill.id === action.payload.billId
            ? { ...bill, paid: action.payload.newPaidStatus, datePaid: action.payload.datePaid }
            : bill
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
    case DELETE_BILL:
      const updatedBills = state.bills.filter((bill) => bill.id !== action.payload);
      return {
        ...state,
        bills: updatedBills,
      };

    default:
      return state;
  }
};

export default billsReducer;
