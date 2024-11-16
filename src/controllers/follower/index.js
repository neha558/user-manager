import express from 'express';
import validateRequest from 'utils/validateRequest';
import followerPolicy from 'policies/follower/follower.policy';
import authenticateToken from '../../middleware/authentication';
import follower from './followerController';
import unfollow from './unfollowController';

import getFollower from './getFollowersController';

const router = express.Router();

router.route('/').get(authenticateToken, getFollower);
router.route('/').get(authenticateToken, getFollower);
router
  .route('/follow')
  .post(authenticateToken, validateRequest(followerPolicy), follower)
  .get(authenticateToken, getFollower);
router
  .route('/unfollow')
  .post(authenticateToken, validateRequest(followerPolicy), unfollow);

module.exports = router;
