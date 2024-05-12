"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MailHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MailHistory.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  MailHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
      sent_at: {
        type: DataTypes.DATE,
      },
      content: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      sent_to: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "MailHistory",
      tableName: "mail_history",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MailHistory;
};
