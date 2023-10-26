import { csrfFetch } from "./csrf";

const SET_REMINDERS = "reminders/setReminders";
const EDIT_REMINDER = "reminders/editReminder";
const DELETE_REMINDER = "reminders/deleteReminder";
const REMOVE_USER = "session/removeUser";

const setReminders = (reminders) => ({
  type: SET_REMINDERS,
  payload: reminders,
});

const editReminder = (reminderId, editedReminder) => ({
  type: EDIT_REMINDER,
  payload: { reminderId, editedReminder },
});

const deleteReminder = (reminderId) => ({
  type: DELETE_REMINDER,
  payload: reminderId,
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
    const existingReminders = getState().reminders.reminders;

    const updatedReminders = [...existingReminders, data.newReminder];

    dispatch(setReminders(updatedReminders));
  } catch (error) {
    // Handle the error gracefully, such as logging it or displaying an error message.
    console.error("Error adding reminder:", error);
    throw error;
  }
};

export const editAReminder = (reminderId, formData) => async (dispatch) => {
  const res = await csrfFetch(`/api/reminders/${reminderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to edit reminder.");

  dispatch(editReminder(reminderId, formData));
  dispatch(fetchReminders());
};

export const deleteAReminder = (reminderId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reminders/${reminderId}`, {
    method: "DELETE",
  });

  if (res.ok) dispatch(deleteReminder(reminderId));

  dispatch(fetchReminders());
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
    case EDIT_REMINDER:
      const { reminderId, editedReminder } = action.payload;
      const reminderIndex = state.reminders.findIndex((reminder) => reminder.id === reminderId);

      if (reminderIndex !== -1) {
        const updatedReminders = [...state.reminders];
        updatedReminders[reminderIndex] = {
          ...updatedReminders[reminderIndex],
          ...editedReminder,
        };

        return {
          ...state,
          reminders: updatedReminders,
        };
      }

      return state;
    case DELETE_REMINDER:
      const updatedReminders = state.reminders.filter((reminder) => reminder.id !== action.payload);

      return {
        ...state,
        reminders: updatedReminders,
      };
    default:
      return state;
  }
};

export default remindersReducer;
