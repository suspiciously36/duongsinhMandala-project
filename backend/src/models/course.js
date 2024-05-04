"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsToMany(models.User, {
        foreignKey: "course_id",
        through: "users_courses",
        as: "users",
      });
    }
  }
  Course.init(
    {
      //Khai báo cột ở trong table
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "courses",
    }
  );
  return Course;
};
