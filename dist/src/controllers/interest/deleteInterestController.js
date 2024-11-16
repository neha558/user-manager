"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _interest = _interopRequireDefault(require("../../services/interest"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var deleteInterestController = function deleteInterestController(req, res, next) {
  _logger["default"].message("Executing deleteInterestController controller");

  _interest["default"].deleteInterestService(req.params).then(function () {
    _logger["default"].message("Executing deleteInterestController was successful");

    res.status(204).send();
  })["catch"](function (error) {
    _logger["default"].message("Error while executing deleteInterestController", 'error');

    next(error);
  });
};

var _default = deleteInterestController;
exports["default"] = _default;