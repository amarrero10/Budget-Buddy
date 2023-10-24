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

module.exports = router;
