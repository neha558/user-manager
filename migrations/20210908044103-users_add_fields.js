module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'isSuspended', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }),
  down: (queryInterface) =>
    queryInterface.removeColumn('users', 'isSuspended'),
};
