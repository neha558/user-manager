import express from 'express';

import validateRequest from 'utils/validateRequest';
import userPolicy from 'policies/user/user.policy';
import socialAuthPolicy from 'policies/user/socialAuth.policy';

import forgotPasswordPolicy from 'policies/user/forgotPassword.policy';
import resetPasswordPolicy from 'policies/user/resetPassword.policy';
import verifyOTPPolicy from 'policies/user/verifyOTP.policy';

import createUser from './createUserController';
import getUser from './getUsersController';
import getUserByUserName from './getUserByUserNameController';
import userLogin from './userLoginController';
import getUserProfile from './getUserProfileController';
import forgotPassword from './forgotPasswordController';
import resetPassword from './resetPasswordController';
import updateUserProfile from './updateProfileController';
import authenticateToken from '../../middleware/authentication';
import verifyUserEmailController from './verifyUserEmailController';
import verifyMobileNumberController from './verifyMobileNumberController';
import resendVerificationCodeController from './resendVerificationCodeController';
import checkUserName from './checkUserNameController';
import decodeToken from '../../middleware/decodeToken';
import socialLogin from './socialLoginController';

const router = express.Router();

router
  .route('/')
  .post(validateRequest(userPolicy), createUser)
  .get(authenticateToken, getUser);
router.route('/validate/:userName').get(decodeToken, checkUserName);
router.route('/login').post(userLogin);
router
  .route('/social-login')
  .post(validateRequest(socialAuthPolicy), socialLogin);
router
  .route('/forgot-password')
  .post(validateRequest(forgotPasswordPolicy), forgotPassword);
router
  .route('/reset-password')
  .post(validateRequest(resetPasswordPolicy), resetPassword);
router
  .route('/profile')
  .get(authenticateToken, getUserProfile)
  .put(authenticateToken, updateUserProfile);

router
  .route('/profile/:userName')
  .get(authenticateToken, getUserByUserName);
router
  .route('/verify/otp')
  .post(
    validateRequest(verifyOTPPolicy),
    verifyMobileNumberController,
  );
router
  .route('/verify/:verificationCode')
  .get(verifyUserEmailController);
router
  .route('/resend/verification')
  .post(resendVerificationCodeController);

module.exports = router;
