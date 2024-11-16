"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _kafkaNode = _interopRequireDefault(require("kafka-node"));

var _logger = _interopRequireDefault(require("../../config/logger"));

var _config = _interopRequireDefault(require("config"));

var client = new _kafkaNode["default"].KafkaClient({
  kafkaHost: _config["default"].get('kafkaHost')
});
var topics = [{
  topic: 'FILE-UPDATE',
  partitions: 1,
  replicationFactor: 1
}, {
  topic: 'USER-NOTIFICATION',
  partitions: 1,
  replicationFactor: 1
}, {
  topic: 'FOLLOWER-UPDATES',
  partitions: 1,
  replicationFactor: 1
}, {
  topic: 'SMS-EMAIL-NOTIFICATION',
  partitions: 1,
  replicationFactor: 1
}, {
  topic: 'UPDATE-ADDRESS-TOPIC',
  partitions: 1,
  replicationFactor: 1
}, {
  topic: 'BLOCK-USER-UPDATES',
  partitions: 1,
  replicationFactor: 1
}];
var admin = new _kafkaNode["default"].Admin(client);

var createKafkaTopics = function createKafkaTopics() {
  _logger["default"].message("Creating topics ".concat(JSON.stringify(topics)));

  admin.createTopics(topics, function (error) {
    if (error) {
      _logger["default"].message("Error occurred while creating a topic ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), 'error');

      return;
    }

    _logger["default"].message("Topics created / already created");
  });
};

var _default = createKafkaTopics;
exports["default"] = _default;