"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _validateRequest = _interopRequireDefault(require("../../utilities/validateRequest"));

var _user = _interopRequireDefault(require("../../policies/user/user.policy"));

var _socialAuth = _interopRequireDefault(require("../../policies/user/socialAuth.policy"));

var _forgotPassword = _interopRequireDefault(require("../../policies/user/forgotPassword.policy"));

var _resetPassword = _interopRequireDefault(require("../../policies/user/resetPassword.policy"));

var _verifyOTP = _interopRequireDefault(require("../../policies/user/verifyOTP.policy"));

var _createUserController = _interopRequireDefault(require("./createUserController"));

var _getUsersController = _interopRequireDefault(require("./getUsersController"));

var _getUserByUserNameController = _interopRequireDefault(require("./getUserByUserNameController"));

var _userLoginController = _interopRequireDefault(require("./userLoginController"));

var _getUserProfileController = _interopRequireDefault(require("./getUserProfileController"));

var _forgotPasswordController = _interopRequireDefault(require("./forgotPasswordController"));

var _resetPasswordController = _interopRequireDefault(require("./resetPasswordController"));

var _updateProfileController = _interopRequireDefault(require("./updateProfileController"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var _verifyUserEmailController = _interopRequireDefault(require("./verifyUserEmailController"));

var _verifyMobileNumberController = _interopRequireDefault(require("./verifyMobileNumberController"));

var _resendVerificationCodeController = _interopRequireDefault(require("./resendVerificationCodeController"));

var _checkUserNameController = _interopRequireDefault(require("./checkUserNameController"));

var _decodeToken = _interopRequireDefault(require("../../middleware/decodeToken"));

var _socialLoginController = _interopRequireDefault(require("./socialLoginController"));

var router = _express["default"].Router();

router.route('/').post((0, _validateRequest["default"])(_user["default"]), _createUserController["default"]).get(_authentication["default"], _getUsersController["default"]);
router.route('/validate/:userName').get(_decodeToken["default"], _checkUserNameController["default"]);
router.route('/login').post(_userLoginController["default"]);
router.route('/social-login').post((0, _validateRequest["default"])(_socialAuth["default"]), _socialLoginController["default"]);
router.route('/forgot-password').post((0, _validateRequest["default"])(_forgotPassword["default"]), _forgotPasswordController["default"]);
router.route('/reset-password').post((0, _validateRequest["default"])(_resetPassword["default"]), _resetPasswordController["default"]);
router.route('/profile').get(_authentication["default"], _getUserProfileController["default"]).put(_authentication["default"], _updateProfileController["default"]);
router.route('/profile/:userName').get(_authentication["default"], _getUserByUserNameController["default"]);
router.route('/verify/otp').post((0, _validateRequest["default"])(_verifyOTP["default"]), _verifyMobileNumberController["default"]);
router.route('/verify/:verificationCode').get(_verifyUserEmailController["default"]);
router.route('/resend/verification').post(_resendVerificationCodeController["default"]);
module.exports = router;