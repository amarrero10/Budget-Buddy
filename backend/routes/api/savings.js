const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { SavingGoal } = require("../../db/models");

const router = express.Router();
router.use(requireAuth);

// CREATE (POST) Savings Goal
router.post("/", async (req, res) => {
  const user = req.user;
  const isComplete = false;
  const { goalName, targetAmount, currentAmount } = req.body;

  const savings = await SavingGoal.create({
    userId: user.id,
    goalName,
    targetAmount,
    currentAmount,
    complete: isComplete,
  });

  return res.json({
    savings,
  });
});

module.exports = router;
