import { csrfFetch } from "./csrf";

const SET_SAVINGS = "savings/setSavings";
const ADD_SAVINGS = "savings/setSavings";
const EDIT_SAVINGS = "savings/editSavings";
const CONTRIBUTE_SAVINGS = "savings/contrbuteSavings";
const DELETE_SAVINGS = "savings/deleteSavings";
const REMOVE_USER = "session/removeUser";

const setSavings = (savings) => ({
  type: SET_SAVINGS,
  payload: savings,
});

const editSavings = (savingsId, editedSavings) => ({
  type: EDIT_SAVINGS,
  payload: { savingsId, editedSavings },
});

const contributeSavings = (savingsId, editedSavings) => ({
  type: CONTRIBUTE_SAVINGS,
  payload: { savingsId, editedSavings },
});

const deleteSavings = (savingsId) => ({
  type: DELETE_SAVINGS,
  payload: savingsId,
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

  console.log("FORM DATA", formData);
  const data = await res.json();

  // Fetch the existing savings data from Redux store state
  const existingSavings = getState().savings.savings;

  // Combine the new savings entry with the existing data
  const updatedSavings = [...existingSavings, data.savings];

  dispatch(setSavings(updatedSavings));
};

export const editASavings = (savingsId, formData) => async (dispatch) => {
  const res = await csrfFetch(`/api/savings/${savingsId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to edit savings");

  dispatch(editSavings(savingsId, formData));
  dispatch(fetchSavings());
};

export const contributeToSavings = (savingsId, formData) => async (dispatch) => {
  console.log("FORM DATA", formData);
  const res = await csrfFetch(`/api/savings/${savingsId}/contribute`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to contribute to savings");

  dispatch(contributeSavings(savingsId, formData));
  dispatch(fetchSavings());
};

export const deleteASavings = (savingsId) => async (dispatch) => {
  const res = await csrfFetch(`/api/savings/${savingsId}`, {
    method: "DELETE",
  });

  if (res.ok) dispatch(deleteSavings(savingsId));

  dispatch(fetchSavings());
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
    case DELETE_SAVINGS:
      const updatedSavings = state.savings.filter((savings) => savings.id !== action.payload);
      return {
        ...state,
        savings: updatedSavings,
      };
    case EDIT_SAVINGS:
      const { savingsId, editedSavings } = action.payload;
      const savingsIndex = state.savings.findIndex((saving) => saving.id === savingsId);

      if (savingsIndex !== -1) {
        const updatedSavings = [...state.savings];
        updatedSavings[savingsIndex] = {
          ...updatedSavings[savingsIndex],
          ...editedSavings,
        };

        return {
          ...state,
          savings: updatedSavings,
        };
      }

      return state;
    case CONTRIBUTE_SAVINGS:
      const { contributedSavingsId, contributedSavings } = action.payload;
      const savingsIdx = state.savings.findIndex((saving) => saving.id === contributedSavingsId);

      if (savingsIdx !== -1) {
        const updatedSavings = [...state.savings];
        updatedSavings[savingsIdx] = {
          ...updatedSavings[savingsIdx],
          ...contributedSavings,
        };

        return {
          ...state,
          savings: updatedSavings,
        };
      }

      return state;
    default:
      return state;
  }
};

export default savingsReducer;
