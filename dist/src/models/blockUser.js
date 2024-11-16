"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(sequelize, DataTypes) {
  var Follow = sequelize.define('blockUsers', {
    blockId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    blockByUserId: {
      type: DataTypes.INTEGER,
      // This id is for User who is Blocking
      allowNull: false
    },
    blockedUserId: {
      type: DataTypes.INTEGER,
      // This id is for User who is Blocked
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    paranoid: true
  });
  return Follow;
};

exports["default"] = _default;