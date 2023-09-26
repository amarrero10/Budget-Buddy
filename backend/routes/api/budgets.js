const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Bill, Budget } = require("../../db/models");
const router = express.Router();
router.use(requireAuth);

// GET specific budget
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const budget = await Budget.findByPk(id, {
    include: [
      {
        model: Bill,
        attributes: [
          "billAmount",
          "billName",
          "billingDay",
          "billingFrequency",
          "billingStartMonth",
          "budgetId",
          "createdAt",
          "dueDate",
          "id",
          "paid",
          "datePaid",
          "paymentLink",
          "updatedAt",
          "userId",
        ],
      },
    ],
  });

  res.status(200).json({ budget });
});

// POST create a budget
router.post("/", async (req, res) => {
  const user = req.user;
  const { budgetName, budgetAmount, budgetLeft, budgetDay, budgetStartMonth, budgetFrequency } =
    req.body;

  const budget = await Budget.create({
    userId: user.id,
    budgetName,
    budgetAmount,
    budgetLeft,
    budgetDay,
    budgetStartMonth,
    budgetFrequency,
  });

  return res.json(budget);
});

router.put("/:id", async (req, res) => {
  user = req.user;
  const { id } = req.params;

  const { budgetName, budgetAmount, budgetLeft } = req.body;

  const budget = await Budget.findByPk(id);

  budget.budgetName = budgetName;
  budget.budgetAmount = budgetAmount;
  budget.budgetLeft = budgetLeft;

  await budget.save();

  res.status(200).json(budget);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const budget = await Budget.findByPk(id);

  if (!budget) return res.status(404).json({ error: "Budget not found" });

  await budget.destroy();

  res.json({ message: "Successfully Deleted!" });
});

module.exports = router;
