import followerService from 'services/follower';
import logger from 'appConfig/logger';

const getFollowing = (req, res, next) => {
  logger.message(`Executing getFollowing`);
  return followerService
    .getFollowingService(req.body.user.userId.toString(), req.query)
    .then((followers) => {
      logger.message(`Executing getFollowing was successful`);
      res.status(200).json(followers);
    })
    .catch((error) => {
      logger.message(`Error while executing getFollowing`);
      next(error);
    });
};

module.exports = getFollowing;
