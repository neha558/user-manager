"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _config = _interopRequireDefault(require("config"));

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

var _userSuspendedTemplate = _interopRequireDefault(require("../../templates/userSuspendedTemplate"));

var sendEmailOrSms = function sendEmailOrSms(user) {
  var notificationEvent = {};
  var statusMessage = user.isSuspended === true ? 'Deactivated' : 'Activated';
  var emailNotification = {
    type: 'EMAIL',
    activityTime: new Date(),
    userId: user.userId,
    emailOptions: {
      from: _config["default"].get('adminEmailId'),
      to: user.email,
      subject: 'Public Poll Profile Update',
      html: (0, _userSuspendedTemplate["default"])(statusMessage, _config["default"].get('IMAGE_URL'))
    }
  };
  var smsNotification = {
    type: 'SMS',
    activityTime: new Date(),
    userId: user.userId,
    smsOptions: {
      message: "Your Profile has been ".concat(statusMessage, " by admin, please contact support on Public Poll"),
      phoneNumber: user.mobileNumber
    }
  };

  if (user.email) {
    notificationEvent = emailNotification;
  } else {
    notificationEvent = smsNotification;
  }

  (0, _publishToKafka["default"])('SMS-EMAIL-NOTIFICATION', notificationEvent, 'CREATE');
};
/**
 *
 * @param {
 * "name":string
 * "UserType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */


var suspendUserService = function suspendUserService(req) {
  _logger["default"].message("Executing suspendUserService");

  var io = req.app.get('io');
  return new Promise(function (resolve, reject) {
    var body = req.body,
        params = req.params;

    _models["default"].User.findOne({
      where: {
        userId: params.userId
      }
    }).then(function (user) {
      if (user) {
        if (user.isSuspended === body.isSuspended) {
          _logger["default"].message("Executing suspendUserService user already ".concat(user.isSuspended ? 'suspended' : 'activated'));

          return reject(new _exceptions.BadRequestException("Account has already ".concat(user.isSuspended ? 'suspended' : 'activated')));
        } // eslint-disable-next-line no-param-reassign


        user.isSuspended = body.isSuspended;
        user.save();
        (0, _publishToKafka["default"])('USER-NOTIFICATION', user, 'UPDATE');
        io.to("session-of-".concat(user.userId)).emit('user-status', JSON.stringify({
          isSuspended: true
        }));
        sendEmailOrSms(user);

        _logger["default"].message("Executing suspendUserService successfully");

        return resolve();
      }

      _logger["default"].message("Executing suspendUserService Unable to find user");

      return reject(new _exceptions.ResourceNotFoundException('Unable to find user'));
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing suspendUserService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to suspend user'));
    });
  });
};

module.exports = suspendUserService;