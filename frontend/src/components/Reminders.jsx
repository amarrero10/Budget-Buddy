import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { RRule } from "rrule";
import rrulePlugin from "@fullcalendar/rrule";
import "./Reminders.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import * as remindersActions from "../store/reminders";

function Reminders() {
  const dispatch = useDispatch();
  const reminders = useSelector((state) => state.reminders?.reminders);
  const [reminderId, setReminderId] = useState("");
  const [addReminderModal, setAddReminderModal] = useState(false);
  const [allRemindersModal, setAllRemindersModal] = useState(false);
  const [editReminderModal, setEditReminderModal] = useState(false);
  const [createReminderForm, setCreateReminderForm] = useState({
    reminder: "",
    reminderDate: "",
  });
  const [editReminderForm, setEditReminderForm] = useState({});
  const [allRemindersDeleteModal, setAllRemindersDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    dispatch(remindersActions.fetchReminders())
      .then((data) => {})
      .catch((error) => {
        console.error("Failed to fetch reminders:", error);
      });
  }, [dispatch]);

  const events = [];

  const handleAddReminderModal = () => {
    setAddReminderModal(true);
  };

  const handleCreateReminderInput = (e) => {
    const { name, value } = e.target;

    setCreateReminderForm({
      ...createReminderForm,
      [name]: value,
    });
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      dispatch(remindersActions.addReminder(createReminderForm));

      setCreateReminderForm({ reminder: "", reminderDate: "" });
      setAddReminderModal(false);
    }
  };

  const handleEditReminderModal = () => {
    setAllRemindersModal(true);
  };

  if (reminders && reminders.length > 0) {
    reminders.forEach((reminder) => {
      const parts = reminder.reminderDate.split("-");
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);

      const start = new Date(year, month, day);
      const offset = start.getTimezoneOffset();
      start.setMinutes(start.getMinutes() + offset);

      const event = {
        title: reminder.reminder,
        start,
        allDay: true,
        id: reminder.id,
      };

      const rrule = new RRule({
        freq: RRule.MONTHLY,
        dtstart: start,
      });

      event.rrule = rrule.toString();
      events.push(event);
    });
  }

  const submitEditForm = (e) => {
    e.preventDefault();
    const isValid = validateEditForm();

    if (isValid) {
      dispatch(remindersActions.editAReminder(reminderId, editReminderForm));
      setEditReminderModal(false);
    }
  };

  const deleteReminder = (e) => {
    e.preventDefault();
    setAllRemindersDeleteModal(false);
    setDeleteModal(false);
    dispatch(remindersActions.deleteAReminder(reminderId));
  };

  const handleEditReminder = async (reminderId) => {
    setEditReminderModal(true);
    setAllRemindersModal(false);
    setReminderId(reminderId);
    const res = await fetch(`/api/reminders/${reminderId}`);
    const data = await res.json();
    const reminderDate = new Date(data.reminder.reminderDate);
    const inputFormattedDate = reminderDate.toISOString().split("T")[0];
    data.reminder.reminderDate = inputFormattedDate;
    setEditReminderForm({
      reminder: data.reminder.reminder || "",
      reminderDate: inputFormattedDate || "",
    });
  };

  const handleEditReminderInput = (e) => {
    const { name, value } = e.target;

    setEditReminderForm({
      ...editReminderForm,
      [name]: value,
    });
  };

  const handleDeleteReminderModal = () => {
    setAllRemindersDeleteModal(true);
  };

  const handleDeleteReminder = (reminderId) => {
    setReminderId(reminderId);
    setDeleteModal(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!createReminderForm.reminder) {
      newErrors.reminder = "Reminder is required.";
    } else if (createReminderForm.reminder.length < 3) {
      newErrors.reminder = "Remineder requires at least 3 characters";
    }

    if (!createReminderForm.reminderDate) {
      newErrors.reminderDate = "Date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editReminderForm.reminder) {
      newErrors.reminder = "Reminder is required.";
    } else if (editReminderForm.reminder.length < 3) {
      newErrors.reminder = "Remineder requires at least 3 characters";
    }

    if (!editReminderForm.reminderDate) {
      newErrors.reminderDate = "Date is required.";
    }

    setEditErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="savings-page">
      <Menu />
      <div className=" calendar">
        <p className=" reminder-title">Your Reminders</p>
        <Fullcalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
          initialView={"dayGridMonth"}
          customButtons={{
            addEvent: {
              text: "Add Reminder",
              click: handleAddReminderModal,
            },
            editEvent: {
              text: "Edit Reminder",
              click: handleEditReminderModal,
            },
            deleteEvent: {
              text: "Delete Reminder",
              click: handleDeleteReminderModal,
            },
          }}
          headerToolbar={{
            start: "today,prev,next,addEvent,editEvent,deleteEvent", // will normally be on the left. if RTL, will be on the right
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
          }}
          height={"1100px"}
          events={events}
          eventDidMount={(info) => {
            tippy(info.el, {
              animation: "scale",
              content: info.event.title,
              allowHTML: true,
              interactive: true,
              interactiveDebounce: 75,
            });
          }}
        />
      </div>
      {addReminderModal && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleAddReminder}>
              <div className="budget-input">
                <label htmlFor="reminder-name">What's the Reminder?</label>
                <input
                  type="text"
                  name="reminder"
                  value={createReminderForm.reminder}
                  onChange={handleCreateReminderInput}
                  placeholder="Pay the electric bill.."
                  id="reminder-name"
                  className="budget-in"
                ></input>
                {errors.reminder && <p className="error-text">{errors.reminder}</p>}
              </div>
              <div className="budget-input">
                <label htmlFor="reminder-date">What's the date?</label>
                <input
                  type="date"
                  name="reminderDate"
                  value={createReminderForm.reminderDate}
                  onChange={handleCreateReminderInput}
                  id="reminder-name"
                  className="budget-in"
                ></input>
                {errors.reminderDate && <p className="error-text">{errors.reminderDate}</p>}
              </div>
              <button onClick={() => setAddReminderModal(!addReminderModal)}>Cancel</button>
              <button type="submit">Add Reminder</button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Reminder Modal */}
      {allRemindersModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Which reminder would you like to edit?</p>
            {reminders.map((reminder) => (
              <div key={reminder.id}>
                <p className="reminder" onClick={() => handleEditReminder(reminder.id)}>
                  {reminder.reminder}
                </p>
              </div>
            ))}
            <div className="modal-btns">
              <button
                style={{ width: "60%" }}
                onClick={() => setAllRemindersModal(!allRemindersModal)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {editReminderModal && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={submitEditForm}>
              <div className="budget-input">
                <label htmlFor="reminder-name">What's the Reminder?</label>
                <input
                  type="text"
                  name="reminder"
                  value={editReminderForm.reminder}
                  onChange={handleEditReminderInput}
                  placeholder="Pay the electric bill.."
                  id="reminder-name"
                  className="budget-in"
                ></input>
                {editErrors.reminder && <p className="error-text">{editErrors.reminder}</p>}
              </div>
              <div className="budget-input">
                <label htmlFor="reminder-date">What's the date?</label>
                <input
                  type="date"
                  name="reminderDate"
                  value={editReminderForm.reminderDate}
                  onChange={handleEditReminderInput}
                  id="reminder-name"
                  className="budget-in"
                ></input>
                {editErrors.reminderDate && <p className="error-text">{editErrors.reminderDate}</p>}
              </div>

              <button type="submit">Edit Reminder</button>
            </form>
            <button
              style={{ width: "100%" }}
              className="modal-btns"
              onClick={() => setEditReminderModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {allRemindersDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Which reminder would you like to delete?</p>
            {reminders.map((reminder) => (
              <div key={reminder.id}>
                <p className="reminder" onClick={() => handleDeleteReminder(reminder.id)}>
                  {reminder.reminder}
                </p>
              </div>
            ))}
            <div className="modal-btns">
              <button
                style={{ width: "60%" }}
                onClick={() => setAllRemindersDeleteModal(!allRemindersDeleteModal)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you wanna delete this reminder?</p>

            <div className="modal-btns">
              <button onClick={() => setDeleteModal(!deleteModal)}>Cancel</button>
              <button onClick={deleteReminder}>Yes, delete!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reminders;
