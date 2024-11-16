"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _config = _interopRequireDefault(require("config"));

var _winston = _interopRequireDefault(require("winston"));

var _winstonCloudwatch = _interopRequireDefault(require("winston-cloudwatch"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var Logger = /*#__PURE__*/function () {
  function Logger() {
    (0, _classCallCheck2["default"])(this, Logger);
    var transports = [new _winston["default"].transports.Console({
      level: _config["default"].get('logLevel')
    })];

    if (_config["default"].get('loggingMedium') === 'cloudwatch') {
      transports.push(new _winstonCloudwatch["default"]({
        cloudWatchLogs: new _awsSdk["default"].CloudWatchLogs(),
        logGroupName: _config["default"].get('logGroupName'),
        logStreamName: 'user-manager',
        awsConfig: {
          region: _config["default"].get('awsRegion')
        }
      }));
    }

    this.winstonLogger = _winston["default"].createLogger({
      transports: transports
    });
  }

  (0, _createClass2["default"])(Logger, [{
    key: "message",
    value: function message(_message) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      var allowedLogLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

      if (typeof level !== 'string' || !allowedLogLevels.includes(level)) {
        // eslint-disable-next-line no-param-reassign
        level = 'info';
      }

      this.winstonLogger.log(level, _message);
    }
  }]);
  return Logger;
}();

var logger = new Logger();
module.exports = logger;