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
  const { paid, datePaid } = req.body;

  const bill = await Bill.findByPk(id);

  bill.paid = paid;
  bill.datePaid = datePaid;
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

  const bill = await Bill.findByPk(id);
  bill.billName = billName;
  bill.paymentLink = paymentLink;
  bill.billingDay = billingDay;
  bill.billingStartMonth = billingStartMonth;
  bill.billingFrequency = billingFrequency;
  bill.billAmount = billAmount;
  bill.budgetId = budgetId;

  await bill.save();

  res.status(200).json(bill);
});

router.post("/", async (req, res) => {
  const user = req.user;
  const {
    billName,
    paymentLink,
    billingDay,
    billingStartMonth,
    billingFrequency,
    dueDate,
    billAmount,
    paid,
    datePaid,
    budgetId,
  } = req.body;

  const bill = await Bill.create({
    userId: user.id,
    billName,
    paymentLink,
    billingDay,
    billingStartMonth,
    billingFrequency,
    dueDate,
    billAmount,
    paid,
    datePaid,
    budgetId,
  });

  return res.json({
    bill: bill,
  });
});

router.post("/budget", async (req, res) => {
  const user = req.user;
  const {
    billName,
    paymentLink,
    billingDay,
    billingStartMonth,
    billingFrequency,
    dueDate,
    billAmount,
    paid,
    datePaid,
    budgetId,
  } = req.body;

  const bill = await Bill.create({
    userId: user.id,
    billName,
    paymentLink,
    billingDay,
    billingStartMonth,
    billingFrequency,
    dueDate,
    billAmount,
    paid,
    datePaid,
    budgetId,
  });

  console.log("NEW BILL FROM BUDGET", bill);

  return res.json({
    bill: bill,
  });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const bill = await Bill.findByPk(id);

  if (!bill) {
    return res.status(404).json({ error: "Bill not found" });
  }

  await bill.destroy();

  res.json({ message: "Successfully Deleted!" });
});

module.exports = router;
