"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _config = _interopRequireDefault(require("config"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _user = _interopRequireDefault(require("./user"));

var _file = _interopRequireDefault(require("./file"));

var _interest = _interopRequireDefault(require("./interest"));

var _address = _interopRequireDefault(require("./address"));

var _follow = _interopRequireDefault(require("./follow"));

var _username = _interopRequireDefault(require("./username"));

var _blockUser = _interopRequireDefault(require("./blockUser"));

var _synced_contacts = _interopRequireDefault(require("./synced_contacts"));

var _reportedUser = _interopRequireDefault(require("./reportedUser"));

var _this = void 0;

var connection = _config["default"].get('db');

var sequelize = new _sequelize["default"](connection.databaseName, connection.databaseUser, connection.databasePassword, {
  host: connection.host,
  dialect: connection.dialect,
  logging: false
});
var db = {
  User: (0, _user["default"])(sequelize, _sequelize["default"].DataTypes),
  File: (0, _file["default"])(sequelize, _sequelize["default"].DataTypes),
  Interest: (0, _interest["default"])(sequelize, _sequelize["default"].DataTypes),
  Address: (0, _address["default"])(sequelize, _sequelize["default"].DataTypes),
  Follow: (0, _follow["default"])(sequelize, _sequelize["default"].DataTypes),
  Username: (0, _username["default"])(sequelize, _sequelize["default"].DataTypes),
  BlockUser: (0, _blockUser["default"])(sequelize, _sequelize["default"].DataTypes),
  syncedContacts: (0, _synced_contacts["default"])(sequelize, _sequelize["default"].DataTypes),
  ReportedUser: (0, _reportedUser["default"])(sequelize, _sequelize["default"].DataTypes)
};
db.User.hasOne(db.Address, {
  as: 'address',
  foreignKey: 'userId'
});
db.User.hasMany(db.Follow, {
  as: 'follow',
  foreignKey: 'userId'
});
db.ReportedUser.belongsTo(db.User, {
  as: 'reportedUserDetail',
  foreignKey: 'userId',
  model: db.ReportedUser
});
db.ReportedUser.belongsTo(db.User, {
  as: 'reportedByUserDetail',
  foreignKey: 'reportedBy',
  model: db.ReportedUser
});

db.User.prototype.validPassword = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(password) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bcrypt["default"].compare(password, _this.password);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
var _default = db;
exports["default"] = _default;