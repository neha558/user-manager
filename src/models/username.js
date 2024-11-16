export default (sequelize, DataTypes) => {
  const Username = sequelize.define(
    'usernames',
    {
      usernameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER, // This id is the id of follower
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      paranoid: true,
    },
  );
  return Username;
};
