"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrypt = exports.encrypt = exports.decodeCursor = exports.encodeCursor = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _crypto = _interopRequireDefault(require("crypto"));

var _config = _interopRequireDefault(require("config"));

/**
 *
 * @param {string} cursor
 */
var encodeCursor = function encodeCursor(cursor) {
  return Buffer.from(cursor.toString()).toString('base64');
};
/**
 *
 * @param {string} encodedCursor
 */


exports.encodeCursor = encodeCursor;

var decodeCursor = function decodeCursor(encodedCursor) {
  return Buffer.from(encodedCursor, 'base64').toString('ascii');
}; // This utility is not encrypting any sensitive data we are only encrypting
// cursors so that no one peeks at the info inside cursor to send incorrect
// get request, change in key would not cause issues and is not required
// hence a constant key


exports.decodeCursor = decodeCursor;
var algorithm = 'aes-256-ctr';

var secretKey = _config["default"].get('cursorEncryptionSecret').toString().trim();

var encrypt = function encrypt(text) {
  var iv = _crypto["default"].randomBytes(16);

  var cipher = _crypto["default"].createCipheriv(algorithm, secretKey, iv);

  var encrypted = Buffer.concat([cipher.update(text), cipher["final"]()]);
  var encryptedDetails = {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
  return encodeCursor("".concat(encryptedDetails.iv, "&").concat(encryptedDetails.content));
};

exports.encrypt = encrypt;

var decrypt = function decrypt(hash) {
  var cursor = decodeCursor(hash);

  var _cursor$split = cursor.split('&'),
      _cursor$split2 = (0, _slicedToArray2["default"])(_cursor$split, 2),
      iv = _cursor$split2[0],
      content = _cursor$split2[1];

  var decipher = _crypto["default"].createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

  var decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher["final"]()]);
  return decrypted.toString();
};

exports.decrypt = decrypt;