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
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            args: [2], // Limit to 2 decimal places
            msg: "Bill amount must have exactly 2 decimal places.",
          },
        },
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
