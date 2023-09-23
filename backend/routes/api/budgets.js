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

module.exports = router;
