const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Reminder } = require("../../db/models");

const router = express.Router();
router.use(requireAuth);

// CREATE (POST) Reminder
router.post("/", async (req, res) => {
  const user = req.user;

  const { reminder, reminderDate } = req.body;

  const newReminder = await Reminder.create({
    userId: user.id,
    reminder,
    reminderDate,
  });

  return res.json({
    newReminder,
  });
});

// GET Reminder by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const reminder = await Reminder.findByPk(id);

  return res.status(200).json({ reminder });
});

// Edit (PUT) a Reminder
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { reminder, reminderDate } = req.body;

  const newReminder = await Reminder.findByPk(id);

  if (!newReminder) {
    return res.status(404).json({ error: "Reminder not found." });
  }

  newReminder.reminder = reminder;
  newReminder.reminderDate = reminderDate;

  await newReminder.save();

  res.status(200).json(newReminder);
});

// DELETE a reminder
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const reminder = await Reminder.findByPk(id);

  if (!reminder) {
    return res.status(404).json({ error: "Reminder not found." });
  }

  await reminder.destroy();

  res.json({ message: "Succesfully Deleted!" });
});

module.exports = router;
