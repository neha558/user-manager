"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var generateException = require("./generateException");

var ExceptionHandler = /*#__PURE__*/function (_Error) {
  (0, _inherits2["default"])(ExceptionHandler, _Error);

  var _super = _createSuper(ExceptionHandler);

  /**
   *
   * @param {number} statusCode valid http status code eg. 401
   * @param {string} title title of error eg. login failed
   * @param {string} description description of error eg. Login failed because of invalid credentials
   * @param {string} type url to the type definition of errors
   */
  function ExceptionHandler(exception) {
    var _this;

    (0, _classCallCheck2["default"])(this, ExceptionHandler);
    _this = _super.call(this);
    generateException((0, _assertThisInitialized2["default"])(_this), 500, 'Something Went Wrong', exception);
    return _this;
  }

  return ExceptionHandler;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

var _default = ExceptionHandler;
exports["default"] = _default;