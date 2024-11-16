import Sequelize from 'sequelize';
import config from 'config';
import bcrypt from 'bcrypt';
import user from './user';
import file from './file';
import interest from './interest';
import address from './address';
import follow from './follow';
import username from './username';
import blockUser from './blockUser';
import syncedContacts from './synced_contacts';
import ReportedUser from './reportedUser';

const connection = config.get('db');
const sequelize = new Sequelize(
  connection.databaseName,
  connection.databaseUser,
  connection.databasePassword,
  {
    host: connection.host,
    dialect: connection.dialect,
    logging: false,
  },
);

const db = {
  User: user(sequelize, Sequelize.DataTypes),
  File: file(sequelize, Sequelize.DataTypes),
  Interest: interest(sequelize, Sequelize.DataTypes),
  Address: address(sequelize, Sequelize.DataTypes),
  Follow: follow(sequelize, Sequelize.DataTypes),
  Username: username(sequelize, Sequelize.DataTypes),
  BlockUser: blockUser(sequelize, Sequelize.DataTypes),
  syncedContacts: syncedContacts(sequelize, Sequelize.DataTypes),
  ReportedUser: ReportedUser(sequelize, Sequelize.DataTypes),
};

db.User.hasOne(db.Address, {
  as: 'address',
  foreignKey: 'userId',
});

db.User.hasMany(db.Follow, {
  as: 'follow',
  foreignKey: 'userId',
});

db.ReportedUser.belongsTo(db.User, {
  as: 'reportedUserDetail',
  foreignKey: 'userId',
  model: db.ReportedUser,
});
db.ReportedUser.belongsTo(db.User, {
  as: 'reportedByUserDetail',
  foreignKey: 'reportedBy',
  model: db.ReportedUser,
});

db.User.prototype.validPassword = async (password) => {
  await bcrypt.compare(password, this.password);
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
