"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Reminders";
    return queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          billId: 1,
          reminderDate: "2023-10-03",
          reminder: "Reminder to pay your Electric bill",
        },
        {
          userId: 1,
          billId: 2,
          reminderDate: "2023-10-13",
          reminder: "Reminder to pay your Capital One Credit Card",
        },
        {
          userId: 1,
          billId: 3,
          reminderDate: "2023-10-7",
          reminder: "Reminder to pay your phone bill",
        },
        {
          userId: 1,
          savingsId: 1,
          reminderDate: "2023-10-7",
          reminder: "Reminder to add to your moving fund",
        },
        {
          userId: 1,
          savingsId: 2,
          reminderDate: "2023-10-7",
          reminder: "Reminder to add to your vaction fund",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Reminders";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1] },
      },
      {}
    );
  },
};
