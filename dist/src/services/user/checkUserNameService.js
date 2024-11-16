"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _sequelize = require("sequelize");

var checkUserNameService = function checkUserNameService(userId, userName) {
  _logger["default"].message("Executing checkUserNameService");

  _logger["default"].message("checking checkUserNameService for userId ".concat(userId, " and userName ").concat(userName));

  var where;

  if (userId) {
    where = (0, _defineProperty2["default"])({
      userName: userName
    }, _sequelize.Op.not, [{
      userId: [userId]
    }]);
  } else {
    where = {
      userName: userName
    };
  }

  return new Promise(function (resolve, reject) {
    _models["default"].Username.count({
      where: where
    }).then(function (userNameResponse) {
      _logger["default"].message("Executing checkUserNameService was successful");

      var responseData = userNameResponse !== 0;
      return resolve(responseData);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing checkUserNameService ".concat(error));

      return reject(new _exceptions.ServerException('Unable to checkUserNameService'));
    });
  });
};

module.exports = checkUserNameService;