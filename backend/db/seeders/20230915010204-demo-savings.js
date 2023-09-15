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
          firstName: "Demo",
          lastName: "User",
          email: "demo@user.io",
          username: "Demo-lition",
          hashpass: bcrypt.hashSync("password"),
        },
        {
          firstName: "Fake1",
          lastName: "User1",
          email: "user1@user.io",
          username: "FakeUser1",
          hashpass: bcrypt.hashSync("password"),
        },
        {
          firstName: "Fake2",
          lastName: "User2",
          email: "user2@user.io",
          username: "FakeUser2",
          hashpass: bcrypt.hashSync("password"),
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
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};
