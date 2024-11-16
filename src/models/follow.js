export default (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'follow',
    {
      followId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER, // This id is the id of follower
        allowNull: false,
      },
      followerId: {
        type: DataTypes.INTEGER, // Follower of
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
