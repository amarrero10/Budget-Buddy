const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Bill, Budget } = require("../../db/models");
const multer = require("multer");
const upload = multer();

const router = express.Router();
router.use(requireAuth);

// GET specific bill
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.user;
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

router.put("/update-bill/:id", upload.none(), async (req, res) => {
  const { id } = req.params;
  const {
    billName,
    paymentLink,
    billingDay,
    billingStartMonth,
    billingFrequency,
    billAmount,
    budgetId,
  } = req.body;

  console.log("BACKEND", billName);

  const bill = await Bill.findByPk(id);
  bill.billName = billName;
  bill.paymentLink = paymentLink;
  bill.billingDay = billingDay;
  bill.billingStartMonth = billingStartMonth;
  bill.billingFrequency = billingFrequency;
  bill.billAmount = billAmount;
  bill.budgetId = budgetId;

  await bill.save();

  console.log("BACKEND BILL", bill);

  res.status(200).json(bill);
});

module.exports = router;
