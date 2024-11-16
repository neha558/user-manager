"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _kafkaNode = _interopRequireDefault(require("kafka-node"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _config = _interopRequireDefault(require("config"));

var client = new _kafkaNode["default"].KafkaClient({
  kafkaHost: _config["default"].get('kafkaHost')
});

var publishToKafka = function publishToKafka(topic, entityDetails, action) {
  try {
    /**
     * Kafka Producer Configuration
     */
    var Producer = _kafkaNode["default"].Producer;
    var producer = new Producer(client);
    producer.on('ready', function () {
      _logger["default"].message("Kafka producer is READY");
    });
    producer.on('error', function (error) {
      _logger["default"].message(error);

      _logger["default"].message("[kafka-producer -> ".concat(topic, "]: connection error"));

      throw error;
    });
    var eventPayload = [{
      topic: topic,
      messages: JSON.stringify({
        data: entityDetails,
        action: action
      })
    }];
    producer.send(eventPayload, function (error) {
      if (error) {
        _logger["default"].message("[kafka-producer -> ".concat(topic, "]: connection error"));
      }

      _logger["default"].message("Response from kafka: ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), 'error');
    });
  } catch (error) {
    _logger["default"].message("Error publishing message to kafka: ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));
  }
};

var _default = publishToKafka;
exports["default"] = _default;