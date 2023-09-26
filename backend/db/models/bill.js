"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bill.hasMany(models.Reminder, {
        foreignKey: "billId",
      });
      Bill.belongsTo(models.Budget, {
        foreignKey: "budgetId",
      });
      Bill.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Bill.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      billName: { type: DataTypes.STRING, allowNull: false },
      paymentLink: { type: DataTypes.STRING },
      dueDate: { type: DataTypes.DATE },
      billingDay: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 31,
          isInt: true,
        },
      },
      billingStartMonth: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [
              [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
            ],
            msg: "Invalid starting month",
          },
        },
      },
      billingFrequency: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [
              ["every week", "every two weeks", "every month", "every quarter", "once a year"],
            ],
            msg: "Invalid billing frequency",
          },
        },
      },
      billAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      budgetId: {
        type: DataTypes.INTEGER,
      },
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      datePaid: {
        type: DataTypes.DATE,
      },
      categoryId: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "Bill",
    }
  );
  return Bill;
};

// "use strict";
// const bcrypt = require("bcryptjs");

// let options = {};
// if (process.env.NODE_ENV === "production") {
//   options.schema = process.env.SCHEMA; // define your schema in options object
// }

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     options.tableName = "Bills";
//     return queryInterface.bulkInsert(
//       options,
//       [
//         {
//           userId: 1,
//           billName: "Electric",
//           paymentLink: "https://tinyurl.com/TecoBill",
//           billingDay: 3,
//           billingStartMonth: "September",
//           billingFrequency: "monthly",
//           billAmount: 120,
//           paid: false,
//           budgetId: 1,
//         },
//         {
//           userId: 1,
//           billName: "Capital One Credit Card",
//           paymentLink: "https://verified.capitalone.com/auth/signin",
//           billingDay: 13,
//           billingStartMonth: "September",
//           billingFrequency: "monthly",
//           billAmount: 60,
//           paid: false,
//           budgetId: 1,
//         },
//         {
//           userId: 1,
//           billName: "AT&T Phone Bill",
//           paymentLink: "https://tinyurl.com/ATT-bill1",
//           billingDay: 7,
//           billingStartMonth: "September",
//           billingFrequency: "monthly",
//           billAmount: 80,
//           paid: true,
//           budgetId: 1,
//         },
//         {
//           userId: 1,
//           billName: "Discover Credit Card",
//           paymentLink: "https://portal.discover.com/customersvcs/universalLogin/ac_main",
//           billingDay: 29,
//           billingStartMonth: "September",
//           billingFrequency: "monthly",
//           billAmount: 75,
//           paid: false,
//           budgetId: 1,
//         },
//         {
//           userId: 1,
//           billName: "Car",
//           paymentLink: "https://www.chase.com/",
//           billingDay: 1,
//           billingStartMonth: "September",
//           billingFrequency: "monthly",
//           billAmount: 300,
//           paid: false,
//           budgetId: 1,
//         },
//         {
//           userId: 1,
//           billName: "gas",
//           billAmount: 50,
//           paid: true,
//           budgetId: 1,
//           dueDate: new Date("2023-09-12T12:00:00Z"),
//           datePaid: new Date("2023-09-12T12:00:00Z"),
//         },
//         {
//           userId: 1,
//           billName: "Taco Bell",
//           billAmount: 10,
//           paid: true,
//           budgetId: 3,
//           dueDate: new Date("2023-09-18T12:00:00Z"),
//           datePaid: new Date("2023-09-18T12:00:00Z"),
//         },
//         {
//           userId: 1,
//           billName: "McDonalds",
//           billAmount: 12,
//           paid: true,
//           budgetId: 3,
//           dueDate: new Date("2023-09-15T12:00:00Z"),
//           datePaid: new Date("2023-09-15T12:00:00Z"),
//         },
//       ],
//       {}
//     );
//   },

//   down: async (queryInterface, Sequelize) => {
//     options.tableName = "Bills";
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(
//       options,
//       {
//         userId: { [Op.in]: [1] },
//       },
//       {}
//     );
//   },
// };
