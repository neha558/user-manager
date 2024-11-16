import express from 'express';
import getUserStatisticsController from './getUserStatisticsController';
import getUsersController from './getUsersController';
import suspendUserController from './suspendUserController';

import authenticateToken from '../../middleware/authentication';

const router = express.Router();

router
  .route('/user-stats')
  .get(authenticateToken, getUserStatisticsController);
router.route('/users').get(authenticateToken, getUsersController);
router
  .route('/users/status/:userId')
  .put(authenticateToken, suspendUserController);

router.use('/report', require('./report'));

module.exports = router;
