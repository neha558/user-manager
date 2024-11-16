import express from 'express';
import authenticateToken from '../../middleware/authentication';
import getFollowing from './getFollowingController';

const router = express.Router();

router.route('/').get(authenticateToken, getFollowing);

module.exports = router;
