module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'appleId', {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
    }),
  down: (queryInterface) =>
    queryInterface.removeColumn('users', 'appleId'),
};
