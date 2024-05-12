"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const sequenceColumn = "id";
    const tableName = [
      "users",
      "blacklists",
      "courses",
      "permissions",
      "phones",
      "providers",
      "roles",
      "roles_permissions",
      "user_agent",
      "user_tokens",
      "users_courses",
      "users_roles",
    ];
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (let i = 0; i < tableName.length; i++) {
        const [[{ max }]] = await queryInterface.sequelize.query(
          `SELECT MAX("${sequenceColumn}") AS max FROM ${tableName[i]};`,
          { transaction }
        );
        await queryInterface.sequelize.query(
          `ALTER SEQUENCE ${tableName[i]}_${sequenceColumn}_seq RESTART WITH ${
            max + 1
          };`,
          { transaction }
        );
      }
    });
  },

  async down(queryInterface, Sequelize) {
    Promise.resolve();
  },
};
