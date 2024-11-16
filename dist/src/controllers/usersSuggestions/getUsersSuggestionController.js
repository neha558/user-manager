"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _usersSuggestions = _interopRequireDefault(require("../../services/usersSuggestions"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getUsersSuggestion = function getUsersSuggestion(req, res, next) {
  _logger["default"].message("Executing getUsersSuggestion");

  _usersSuggestions["default"].getUsersSuggestionService(req.query, req.body).then(function (user) {
    _logger["default"].message("Executing getUsersSuggestion was successful");

    return res.status(200).json(user);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getUsersSuggestion", 'error');

    return next(error);
  });
};

var _default = getUsersSuggestion;
exports["default"] = _default;