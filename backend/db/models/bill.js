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
        foreignKey: "billId",
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
      dueDate: { type: DataTypes.DATE, allowNull: false },
      billAmount: { type: DataTypes.INTEGER, allowNull: false },
      categoryId: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "Bill",
    }
  );
  return Bill;
};
