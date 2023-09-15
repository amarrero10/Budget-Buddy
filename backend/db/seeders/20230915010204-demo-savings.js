"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "SavingGoals";
    return queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          goalName: "Moving Fund",
          targetAmount: 3000,
          currentAmount: 0,
        },
        {
          userId: 1,
          goalName: "Vaction Fund",
          targetAmount: 4000,
          currentAmount: 0,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "SavingGoals";
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
