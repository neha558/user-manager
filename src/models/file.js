export default (sequelize, DataTypes) => {
  const File = sequelize.define(
    'files',
    {
      fileId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
    },
  );
  return File;
};
