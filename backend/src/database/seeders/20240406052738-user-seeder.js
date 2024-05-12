"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        id: "1",
        name: "Admin",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("123123", 10),
        status: true,
        provider_id: "1",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const provider_data = [
      {
        id: "1",
        name: "localEmail",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const courses_data = [
      {
        id: "1",
        name: "HTML + CSS",
        price: "10000",
        description: "HTML/CSS Best Course",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "2",
        name: "Javascript",
        price: "20000",
        description: "Javascript Best Course",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "3",
        name: "ReactJS",
        price: "25000",
        description: "ReactJS Best Course",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "4",
        name: "NodeJS",
        price: "30000",
        description: "NodeJS Best Course",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("providers", provider_data);
    await queryInterface.bulkInsert("users", data);
    await queryInterface.bulkInsert("courses", courses_data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("providers");
    await queryInterface.bulkDelete("users");
    await queryInterface.bulkDelete("courses");
  },
};
