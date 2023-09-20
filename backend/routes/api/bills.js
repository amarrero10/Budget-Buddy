const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Bill, Budget } = require("../../db/models");

const router = express.Router();
router.use(requireAuth);

// GET specific bill
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (user) {
    const billDetail = await Bill.findByPk(id);

    res.status(200).json({ bill: billDetail });
  }
});

// PUT - mark bill as paid
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { paid } = req.body;

  const bill = await Bill.findByPk(id);

  bill.paid = paid;
  await bill.save();

  res.status(200).json(bill);
});

module.exports = router;
