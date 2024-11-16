/* eslint-disable camelcase */
export default (sequelize, DataTypes) => {
  const syncedContacts = sequelize.define(
    'synced_contacts',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      },
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      systemFirstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      systemLastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFollowing: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contactUserName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      paranoid: true,
    },
  );
  return syncedContacts;
};
