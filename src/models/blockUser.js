export default (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'blockUsers',
    {
      blockId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      blockByUserId: {
        type: DataTypes.INTEGER, // This id is for User who is Blocking
        allowNull: false,
      },
      blockedUserId: {
        type: DataTypes.INTEGER, // This id is for User who is Blocked
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
    },
  );
  return Follow;
};
