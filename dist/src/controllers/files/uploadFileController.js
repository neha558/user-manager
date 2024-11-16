"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _file = _interopRequireDefault(require("../../services/file"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var uploadFile = function uploadFile(req, res, next) {
  if (req.files === undefined) {
    return res.status(400).json({
      message: 'File not selected'
    });
  }

  var image = req.files.file;
  var path = "./uploads/".concat(image.name);
  image.mv(path, function (error) {
    if (error) {
      next(error);
    }

    var data = {
      filePath: "".concat(image.name)
    };

    _logger["default"].message("Executing createUser controller");

    _file["default"].uploadFileService(data).then(function (responseData) {
      _logger["default"].message("Executing createUser was successful");

      res.status(201).json(responseData);
    })["catch"](function (responseError) {
      _logger["default"].message("Error while executing file".concat(responseError), 'error');

      next(error);
    });
  });
  return true;
};

var _default = uploadFile;
exports["default"] = _default;