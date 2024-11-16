module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('synced_contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contactId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      contactNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      systemFirstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      systemLastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isFollowing: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      isFollowed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      contactUserName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('synced_contacts');
  },
};
