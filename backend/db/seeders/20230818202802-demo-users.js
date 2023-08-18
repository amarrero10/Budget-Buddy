"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "Demo",
          lastName: "User",
          email: "demo@user.io",
          username: "Demo-lition",
          hashPass: bcrypt.hashSync("password"),
        },
        {
          firstName: "Fake1",
          lastName: "User1",
          email: "user1@user.io",
          username: "FakeUser1",
          hashPass: bcrypt.hashSync("password"),
        },
        {
          firstName: "Fake2",
          lastName: "User2",
          email: "user2@user.io",
          username: "FakeUser2",
          hashPass: bcrypt.hashSync("password"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
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
