const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const billRouter = require("./bills.js");
const budgetRouter = require("./budgets.js");
const savingsRouter = require("./savings.js");
const remindersRouter = require("./reminders.js");
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/bills", billRouter);
router.use("/budgets", budgetRouter);
router.use("/savings", savingsRouter);
router.use("/reminders", remindersRouter);

const { setTokenCookie } = require("../../utils/auth.js");
const { User } = require("../../db/models");
router.get("/set-token-cookie", async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: "Demo-lition",
    },
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
