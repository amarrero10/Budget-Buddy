"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reminder.belongsTo(models.Bill, {
        foreignKey: "billId",
      });
      Reminder.belongsTo(models.SavingGoal, {
        foreignKey: "savingsId",
      });
      Reminder.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Reminder.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      billId: { type: DataTypes.INTEGER },
      savingsId: { type: DataTypes.INTEGER },
      reminderDate: { type: DataTypes.DATE, allowNull: false },
      reminder: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Reminder",
    }
  );
  return Reminder;
};
