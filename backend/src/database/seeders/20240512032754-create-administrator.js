"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const role_data = [
      {
        id: "1",
        name: "Administrator",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const permissions_data = [
      {
        id: "1",
        value: "users.read",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "2",
        value: "users.create",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "3",
        value: "users.update",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "4",
        value: "users.delete",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "5",
        value: "roles.read",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "6",
        value: "roles.create",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "7",
        value: "roles.update",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "8",
        value: "roles.delete",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const users_roles_data = [
      {
        id: "1",
        user_id: "1",
        role_id: "1",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const roles_permissions_data = [
      {
        id: "1",
        role_id: "1",
        permission_id: "1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "2",
        role_id: "1",
        permission_id: "2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "3",

        role_id: "1",
        permission_id: "3",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "4",

        role_id: "1",
        permission_id: "4",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "5",

        role_id: "1",
        permission_id: "5",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "6",

        role_id: "1",
        permission_id: "6",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "7",

        role_id: "1",
        permission_id: "7",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "8",

        role_id: "1",
        permission_id: "8",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("roles", role_data);
    await queryInterface.bulkInsert("permissions", permissions_data);
    await queryInterface.bulkInsert("users_roles", users_roles_data);
    await queryInterface.bulkInsert(
      "roles_permissions",
      roles_permissions_data
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles");
    await queryInterface.bulkDelete("permissions");
    await queryInterface.bulkDelete("users_roles");
    await queryInterface.bulkDelete("roles_permissions");
  },
};
