"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(sequelize, DataTypes) {
  var user = sequelize.define('interest', {
    interestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    interest: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    paranoid: true
  });
  return user;
};

exports["default"] = _default;