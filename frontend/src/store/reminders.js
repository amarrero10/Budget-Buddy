import { csrfFetch } from "./csrf";

const SET_REMINDERS = "reminders/setReminders";
const REMOVE_USER = "session/removeUser";

const setReminders = (reminders) => ({
  type: SET_REMINDERS,
  payload: reminders,
});

export const fetchReminders = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/users/current/reminders");

    if (!res.ok) {
      throw new Error("Failed to fetch reminders data");
    }

    const data = await res.json();

    // Dispatch the data to update the Redux store
    dispatch(setReminders(data.Reminders));

    // Return the data so you can access it when you call the action
    return data.Reminders;
  } catch (error) {
    // Handle errors, and you can choose to return a default value or throw an error here
    throw new Error(`Failed to fetch reminders: ${error.message}`);
  }
};

export const addReminder = (formData) => async (dispatch, getState) => {
  try {
    const res = await csrfFetch("/api/reminders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      // Handle the error here, such as displaying an error message or throwing an exception.
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const data = await res.json();

    console.log("NEW DATA FROM FORM", data);
    const existingReminders = getState().reminders.reminders;

    console.log("EXISTING REMINDERS", existingReminders);

    const updatedReminders = [...existingReminders, data.newReminder];

    console.log("UPDATED REMINDERS", updatedReminders);

    dispatch(setReminders(updatedReminders));
  } catch (error) {
    // Handle the error gracefully, such as logging it or displaying an error message.
    console.error("Error adding reminder:", error);
    throw error;
  }
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
