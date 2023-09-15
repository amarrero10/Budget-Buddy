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
      resetDate: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Budget",
    }
  );
  return Budget;
};
