"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Budget.hasMany(models.Bill, {
        foreignKey: "budgetId",
      });
      Budget.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Budget.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      budgetName: { type: DataTypes.STRING, allowNull: false },
      budgetAmount: { type: DataTypes.INTEGER, allowNull: false },
      budgetDay: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 31,
          isInt: true,
        },
      },
      budgetStartMonth: {
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
      budgetFrequency: {
        validate: {
          isIn: {
            args: [
              ["every week", "every two weeks", "every month", "every quarter", "once a year"],
            ],
            msg: "Invalid budget frequency",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Budget",
    }
  );
  return Budget;
};
