"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _exceptions = require("../../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../../models"));

var _ResourceNotFoundException = _interopRequireDefault(require("../../../utilities/exceptions/ResourceNotFoundException"));

var _logger = _interopRequireDefault(require("../../../../config/logger"));

var updateReportedUserStatusService = function updateReportedUserStatusService(_ref) {
  var params = _ref.params,
      body = _ref.body;
  return new Promise(function (resolve, reject) {
    _logger["default"].message("Executing updateUserStatusService");

    _models["default"].ReportedUser.update({
      read: body.read
    }, {
      where: {
        reportId: +params.id
      },
      returning: true
    }).then(function (updatedUserResponse) {
      if (updatedUserResponse[0] !== 0) {
        return resolve({
          message: 'Reported User status updated successfully',
          updateUserResponse: updatedUserResponse[1][0]
        });
      }

      _logger["default"].message("reported user id ".concat(params.id, " not found"));

      return reject(new _ResourceNotFoundException["default"]('Reported User not found'));
    })["catch"](function (error) {
      _logger["default"].message("Uncaught error occurred status ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Reported user update failed.', error));
    });
  });
};

module.exports = updateReportedUserStatusService;