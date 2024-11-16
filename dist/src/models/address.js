"use strict";

module.exports = function (sequelize, DataTypes) {
  var Address = sequelize.define('address', {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres

    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize: sequelize
  });
  return Address;
};