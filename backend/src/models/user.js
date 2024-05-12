"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Phone, {
        foreignKey: "user_id",
        as: "phone",
      });
      User.hasOne(models.MailHistory, {
        foreignKey: "user_id",
        as: "mailHistory",
      });
      User.belongsToMany(models.Course, {
        foreignKey: "user_id",
        through: "users_courses",
        as: "courses",
      });
      User.belongsToMany(models.Role, {
        foreignKey: "user_id",
        through: "users_roles",
        as: "roles",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      provider_id: {
        type: DataTypes.INTEGER,
      },
      reset_token: {
        type: DataTypes.INTEGER,
      },
      expire_token: {
        type: DataTypes.INTEGER,
      },
      activation_code: {
        type: DataTypes.TEXT,
      },
      remembered: {
        type: DataTypes.BOOLEAN,
      },
      remember_token: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
