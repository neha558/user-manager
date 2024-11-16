"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _interest = _interopRequireDefault(require("../../services/interest"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var updateInterestController = function updateInterestController(req, res, next) {
  _logger["default"].message("Executing updateInterestController controller");

  _interest["default"].updateInterestService(req.body, req.params).then(function () {
    _logger["default"].message("Executing updateInterestController was successful");

    res.status(204).send();
  })["catch"](function (error) {
    _logger["default"].message("Error while executing updateInterestController", 'error');

    next(error);
  });
};

var _default = updateInterestController;
exports["default"] = _default;