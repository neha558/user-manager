import express from 'express';
import validateRequest from 'utils/validateRequest';
import reportPolicy from 'policies/report/report.policy';
import createReportedUser from './createUserReportController';
import authenticateToken from '../../middleware/authentication';

const router = express.Router();

router
  .route('/')
  .post(
    authenticateToken,
    validateRequest(reportPolicy),
    createReportedUser,
  );

module.exports = router;
