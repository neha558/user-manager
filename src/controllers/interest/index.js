import express from 'express';

import getInterest from './getInterestController';
import createInterest from './createInterestController';
import updateInterestController from './updateInterestController';
import deleteInterestController from './deleteInterestController';

import authenticateToken from '../../middleware/authentication';

const router = express.Router();

router.route('/').get(getInterest).post(createInterest);
router
  .route('/:interestId')
  .delete(authenticateToken, deleteInterestController)
  .put(authenticateToken, updateInterestController);

module.exports = router;
