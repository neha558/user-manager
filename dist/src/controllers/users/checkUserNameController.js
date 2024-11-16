"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var checkUserName = function checkUserName(req, res, next) {
  var _req$body$user;

  _logger["default"].message("Executing checkUserName");

  var userId = (_req$body$user = req.body.user) !== null && _req$body$user !== void 0 && _req$body$user.userId ? req.body.user.userId : null;

  _user["default"].checkUserNameService(userId, req.params.userName).then(function (isUserNameTaken) {
    _logger["default"].message("Executing checkUserName was successful");

    return res.status(200).json({
      isUserNameTaken: isUserNameTaken
    });
  })["catch"](function (error) {
    _logger["default"].message("Error while executing checkUserName".concat(error));

    next(error);
  });
};

var _default = checkUserName;
exports["default"] = _default;