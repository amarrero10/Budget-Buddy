const express = require("express");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Bill, Budget, SavingGoal, Reminder } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post("/signup", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const hashpass = bcrypt.hashSync(password);
  const user = await User.create({ firstName, lastName, email, username, hashpass });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

// Get all bills of current user
router.get("/current/bills", requireAuth, async (req, res) => {
  const user = req.user;
  if (user) {
    const bills = await Bill.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Budget,
          attributes: ["budgetAmount", "budgetName"],
        },
      ],
    });

    res.status(200).json({ Bills: bills });
  }
});

router.get("/current/budgets", requireAuth, async (req, res) => {
  const user = req.user;

  if (user) {
    const budgets = await Budget.findAll({
      where: {
        userId: user.id,
      },
    });

    res.status(200).json({ Budgets: budgets });
  }
});

router.get("/current/savings-goals", requireAuth, async (req, res) => {
  const user = req.user;

  if (user) {
    const savingsGoals = await SavingGoal.findAll({
      where: {
        userId: user.id,
      },
    });

    res.status(200).json({ Savings: savingsGoals });
  }
});

router.get("/current/reminders", requireAuth, async (req, res) => {
  const user = req.user;
  if (user) {
    const reminders = await Reminder.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Bill,
          attributes: ["billName"],
        },
        {
          model: SavingGoal,
          attributes: ["goalName"],
        },
      ],
    });

    res.status(200).json({ Reminders: reminders });
  }
});

router.get("/current/account", requireAuth, async (req, res) => {
  const user = req.user;

  if (user) {
    const userDetails = await User.findByPk(user.id, {
      attributes: ["id", "firstName", "lastName", "email", "username", "createdAt", "updatedAt"],
    });

    res.status(200).json({ User: userDetails });
  }
});

module.exports = router;
