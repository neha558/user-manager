"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _exceptions = require("../../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../../models"));

var _logger = _interopRequireDefault(require("../../../../config/logger"));

var _generateQuery2 = _interopRequireDefault(require("../../../utilities/generateQuery"));

var generateIncludes = function generateIncludes() {
  return [{
    model: _models["default"].User,
    as: 'reportedUserDetail',
    required: true,
    attributes: ['firstName', 'lastName', 'userName', 'email', 'mobileNumber', 'imageId', 'profileBanner', 'gender', 'isSuspended', 'createdAt'],
    include: [{
      model: _models["default"].Address,
      though: 'addresses',
      as: 'address'
    }]
  }, {
    model: _models["default"].User,
    as: 'reportedByUserDetail',
    required: true,
    attributes: ['firstName', 'lastName', 'userName', 'imageId', 'profileBanner']
  }];
};

var getAdminReportedUserService = function getAdminReportedUserService(_ref) {
  var query = _ref.query;

  var _ref2 = query || {},
      _ref2$limit = _ref2.limit,
      limit = _ref2$limit === void 0 ? 20 : _ref2$limit,
      _ref2$offset = _ref2.offset,
      offset = _ref2$offset === void 0 ? 0 : _ref2$offset;

  var _generateQuery = (0, _generateQuery2["default"])(query),
      order = _generateQuery.order,
      where = _generateQuery.where;

  return new Promise(function (resolve, reject) {
    _logger["default"].message("Executing getAdminReportedUserService");

    _models["default"].ReportedUser.findAndCountAll({
      include: generateIncludes(),
      limit: limit,
      offset: offset,
      order: order,
      where: where
    }).then(function (result) {
      _logger["default"].message("Executing getAdminReportedUserService was successful");

      return resolve({
        pageInfo: {
          totalCount: result.count
        },
        data: result.rows
      });
    })["catch"](function (error) {
      _logger["default"].message("Uncaught error occurred status ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to get admin Poll', error));
    });
  });
};

module.exports = getAdminReportedUserService;