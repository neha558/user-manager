"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Sentry = require('@sentry/node');

var SentryLogger = function SentryLogger(dsn) {
  Sentry.init({
    dsn: dsn
  });
  return Sentry;
};

var _default = SentryLogger;
exports["default"] = _default;