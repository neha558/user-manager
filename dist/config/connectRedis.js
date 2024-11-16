"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ioredis = _interopRequireDefault(require("ioredis"));

var _config = _interopRequireDefault(require("config"));

var _logger = _interopRequireDefault(require("./logger"));

var redisClient = _ioredis["default"].createClient({
  port: _config["default"].get('redisPort'),
  host: _config["default"].get('redisHost'),
  password: _config["default"].get('redisPassword')
});

redisClient.on('error', function (error) {
  _logger["default"].message("Error on redis connection ".concat(error));
});
var _default = redisClient;
exports["default"] = _default;