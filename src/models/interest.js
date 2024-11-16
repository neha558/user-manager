export default (sequelize, DataTypes) => {
  const user = sequelize.define(
    'interest',
    {
      interestId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      interest: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
    },
  );
  return user;
};
