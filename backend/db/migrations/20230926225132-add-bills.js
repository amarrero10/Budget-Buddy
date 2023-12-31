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
        },
        billingDay: {
          type: Sequelize.INTEGER,
        },
        billingStartMonth: {
          type: Sequelize.STRING,
        },
        billingFrequency: {
          type: Sequelize.STRING,
        },
        billAmount: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        paid: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        datePaid: {
          type: Sequelize.DATE,
        },
        budgetId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Budgets", // Name of the referenced table
            key: "id", // Name of the referenced column
          },
          onDelete: "CASCADE",
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
