"use strict";
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Bills",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        billName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        paymentLink: {
          type: Sequelize.STRING,
        },
        dueDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        billAmount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        budgetId: {
          type: Sequelize.INTEGER,
        },
        categoryId: {
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Bills";
    await queryInterface.dropTable("Bills");
  },
};
