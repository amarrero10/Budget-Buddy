"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SavingGoal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SavingGoal.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      goalName: { type: DataTypes.STRING, allowNull: false },
      targetAmount: { type: DataTypes.INTEGER, allowNull: false },
      currentAmount: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "SavingGoal",
    }
  );
  return SavingGoal;
};
