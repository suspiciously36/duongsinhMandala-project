"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "remembered", {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn("users", "remember_token", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "remembered");
    await queryInterface.removeColumn("users", "remember_token");
  },
};
