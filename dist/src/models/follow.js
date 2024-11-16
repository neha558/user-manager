"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(sequelize, DataTypes) {
  var Follow = sequelize.define('follow', {
    followId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      // This id is the id of follower
      allowNull: false
    },
    followerId: {
      type: DataTypes.INTEGER,
      // Follower of
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    paranoid: true
  });
  return Follow;
};

exports["default"] = _default;