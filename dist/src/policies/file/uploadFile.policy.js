"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _require = require("../../utilities/constants"),
    IMAGE_SIZE = _require.IMAGE_SIZE;

var uploadFileSchema = {
  files: function files(req) {
    var file = req.files.file.size;

    if (!file) {
      return {
        error: 'Please upload file'
      };
    }

    if (file.size > IMAGE_SIZE) {
      return {
        error: 'file size cannot be greater than 2MB'
      };
    }

    return {
      message: 'File has been validated successfully'
    };
  }
};
var _default = uploadFileSchema;
exports["default"] = _default;