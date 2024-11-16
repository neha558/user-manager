import express from 'express';
import authorizedRoles from '../middleware/authorizedRoles';
import authenticateToken from '../middleware/authentication';
import ROLES from '../constant/roles';

const router = express.Router();

router.use('/user', require('./users'));
router.use('/contacts', require('./contacts'));
router.use('/fileUpload', require('./files'));
router.use('/interest', require('./interest'));
router.use('/address', require('./address'));
router.use('/follower', require('./follower'));
router.use('/following', require('./follower/following'));
router.use('/blockUser', require('./blockUser'));
router.use('/user/report', require('./report'));

router.use('/users/suggestions', require('./usersSuggestions'));
router.use(
  '/admin',
  authenticateToken,
  authorizedRoles(ROLES.ADMIN),
  require('./admin'),
);

module.exports = router;
