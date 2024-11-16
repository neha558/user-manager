import express from 'express';
import blockUserPolicy from 'policies/blockUser/blockUser.policy';
import validateRequest from 'utils/validateRequest';
import authenticateToken from '../../middleware/authentication';
import blockUser from './blockUserController';

const router = express.Router();
router
  .route('/block')
  .post(
    authenticateToken,
    validateRequest(blockUserPolicy),
    blockUser,
  );

router
  .route('/unblock')
  .post(
    authenticateToken,
    validateRequest(blockUserPolicy),
    blockUser,
  );

module.exports = router;
