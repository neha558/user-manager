"use strict";

module.exports = function (sequelize, DataTypes) {
  var reportedUser = sequelize.define('reported_users', {
    reportId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reportedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize: sequelize,
    paranoid: true
  });
  return reportedUser;
};