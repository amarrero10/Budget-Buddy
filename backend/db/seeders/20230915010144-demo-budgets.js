"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Budgets";
    return queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          budgetName: "Monthly Bills",
          budgetAmount: 5000,
          budgetLeft: 5000,
        },
        {
          userId: 1,
          budgetName: "Gas",
          budgetAmount: 300,
          budgetLeft: 300,
        },
        {
          userId: 1,
          budgetName: "Fun Money",
          budgetAmount: 500,
          budgetLeft: 500,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Budgets";
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
