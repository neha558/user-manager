"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _config = _interopRequireDefault(require("config"));

var _logger = _interopRequireDefault(require("../../config/logger"));

var smtp = _config["default"].get('smtp');

var transporter = _nodemailer["default"].createTransport(smtp);

var sendEmailNotification = function sendEmailNotification(emailOptions) {
  transporter.sendMail(emailOptions).then(function (info) {
    _logger["default"].message("Email sent to ".concat(info.envelope.to));
  })["catch"](function (error) {
    _logger["default"].message("Error occurred while sending email ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));
  });
};

var _default = sendEmailNotification;
exports["default"] = _default;