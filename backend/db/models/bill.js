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
      // define association here
    }
  }
  Bill.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      billName: { type: DataTypes.STRING, allowNull: false },
      paymentLink: { type: DataTypes.STRING, allowNull: false },
      dueDate: { type: DataTypes.DATE, allowNull: false },
      billAmount: { type: DataTypes.INTEGER, allowNull: false },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Bill",
    }
  );
  return Bill;
};
