"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _file = _interopRequireDefault(require("../../services/file"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _fs = _interopRequireDefault(require("fs"));

var getFile = function getFile(req, res, next) {
  _logger["default"].message("Executing getFile controller");

  _file["default"].getFileService(req.params.fileId).then(function (responseData) {
    _logger["default"].message("Executing getFile was successful");

    _fs["default"].readFile("./uploads/".concat(responseData.filePath), function (error, content) {
      if (error) {
        _logger["default"].message("Unable to find File".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

        res.writeHead(400, {
          'Content-type': 'text/html'
        });
        res.end('No such image');
      } else {
        res.writeHead(200, {
          'Content-type': 'image/jpg'
        });
        res.end(content);
      }
    });
  })["catch"](function (error) {
    _logger["default"].message("Error while executing file".concat((error === null || error === void 0 ? void 0 : error.stack) || error), 'error');

    next(error);
  });
};

var _default = getFile;
exports["default"] = _default;