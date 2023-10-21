const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { SavingGoal } = require("../../db/models");

const router = express.Router();
router.use(requireAuth);

// GET Specific Savings Goal
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const savings = await SavingGoal.findByPk(id);

  return res.status(200).json({ savings });
});

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

// UPDATE (PUT) Savings Goal
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { goalName, targetAmount, currentAmount } = req.body;

  const savings = await SavingGoal.findByPk(id);

  if (!savings) {
    return res.status(404).json({ error: "Savings not found" });
  }

  savings.goalName = goalName;
  savings.targetAmount = targetAmount;
  savings.currentAmount = currentAmount;

  await savings.save();

  res.status(200).json(savings);
});

// Update (PUT) Contributed Amount
router.put("/:id/contribute", async (req, res) => {
  const { id } = req.params;
  const { goalName, targetAmount, currentAmount } = req.body;

  const savings = await SavingGoal.findByPk(id);
  if (!savings) {
    return res.status(404).json({ error: "Savings not found" });
  }

  savings.goalName = goalName;
  savings.targetAmount = targetAmount;
  savings.currentAmount = currentAmount;

  await savings.save();

  res.status(200).json(savings);
});

// DELETE Savings Goal
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const savings = await SavingGoal.findByPk(id);

  if (!savings) {
    return res.status(404).json({ error: "Savings not found" });
  }

  await savings.destroy();

  res.json({ message: "Successfully Deleted!" });
});

module.exports = router;
