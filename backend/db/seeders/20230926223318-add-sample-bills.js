"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Bills";
    return queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          billName: "Electric",
          paymentLink: "https://tinyurl.com/TecoBill",
          billingDay: 3,
          billingStartMonth: "September",
          billingFrequency: "monthly",
          billAmount: 120.0,
          paid: false,
          budgetId: 1,
        },
        {
          userId: 1,
          billName: "Capital One Credit Card",
          paymentLink: "https://verified.capitalone.com/auth/signin",
          billingDay: 13,
          billingStartMonth: "September",
          billingFrequency: "monthly",
          billAmount: 60.0,
          paid: false,
          budgetId: 1,
        },
        {
          userId: 1,
          billName: "AT&T Phone Bill",
          paymentLink: "https://tinyurl.com/ATT-bill1",
          billingDay: 7,
          billingStartMonth: "September",
          billingFrequency: "monthly",
          billAmount: 80.13,
          paid: false,
          budgetId: 1,
          datePaid: new Date("2023-09-07T12:00:00Z"),
        },
        {
          userId: 1,
          billName: "Discover Credit Card",
          paymentLink: "https://portal.discover.com/customersvcs/universalLogin/ac_main",
          billingDay: 29,
          billingStartMonth: "September",
          billingFrequency: "monthly",
          billAmount: 75.25,
          paid: false,
          budgetId: 1,
        },
        {
          userId: 1,
          billName: "Car",
          paymentLink: "https://www.chase.com/",
          billingDay: 1,
          billingStartMonth: "September",
          billingFrequency: "monthly",
          billAmount: 300.2,
          paid: false,
          budgetId: 1,
        },
        {
          userId: 1,
          billName: "gas",
          billAmount: 50.0,
          paid: true,
          budgetId: 1,
          dueDate: new Date("2023-09-12T12:00:00Z"),
          datePaid: new Date("2023-09-12T12:00:00Z"),
        },
        {
          userId: 1,
          billName: "Taco Bell",
          billAmount: 10.0,
          paid: true,
          budgetId: 3,
          dueDate: new Date("2023-09-18T12:00:00Z"),
          datePaid: new Date("2023-09-18T12:00:00Z"),
        },
        {
          userId: 1,
          billName: "McDonalds",
          billAmount: 12.12,
          paid: true,
          budgetId: 3,
          dueDate: new Date("2023-09-15T12:00:00Z"),
          datePaid: new Date("2023-09-15T12:00:00Z"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bills";
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
