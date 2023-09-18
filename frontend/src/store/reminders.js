import { csrfFetch } from "./csrf";

const SET_REMINDERS = "reminders/setReminders";
const REMOVE_USER = "session/removeUser";

const setReminders = (reminders) => ({
  type: SET_REMINDERS,
  payload: reminders,
});

export const fetchReminders = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/current/reminders");

  if (!res.ok) {
    throw new Error("Failed to fetch reminders data");
  }

  const data = await res.json();

  dispatch(setReminders(data.Reminders));
};

const initialState = { reminders: null };

const remindersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REMINDERS:
      return {
        ...state,
        reminders: action.payload,
      };
    case REMOVE_USER:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default remindersReducer;
