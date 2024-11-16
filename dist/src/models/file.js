"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(sequelize, DataTypes) {
  var File = sequelize.define('files', {
    fileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres

    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    paranoid: true
  });
  return File;
};

exports["default"] = _default;