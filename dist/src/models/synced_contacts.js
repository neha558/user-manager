"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* eslint-disable camelcase */
var _default = function _default(sequelize, DataTypes) {
  var syncedContacts = sequelize.define('synced_contacts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres

    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      "default": 0
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    systemFirstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    systemLastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isFollowing: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isFollowed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    contactUserName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contactUserId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize: sequelize,
    paranoid: true
  });
  return syncedContacts;
};

exports["default"] = _default;