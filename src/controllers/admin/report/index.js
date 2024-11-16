import express from 'express';
import getReportedUsersController from './getReportController';
import updateReportedUserStatusController from './updateReportStatusController';

const router = express.Router();
router.route('/').get(getReportedUsersController);
router.route('/status/:id').put(updateReportedUserStatusController);

module.exports = router;
