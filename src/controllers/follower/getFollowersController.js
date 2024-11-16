import followerService from 'services/follower';
import logger from 'appConfig/logger';

const getFollower = (req, res, next) => {
  logger.message(`Executing getFollower`);
  return followerService
    .getFollowersService(req.body.user.userId.toString(), req.query)
    .then((followers) => {
      logger.message(`Executing getFollower was successful`);
      res.status(200).json(followers);
    })
    .catch((error) => {
      logger.message(`Error while executing getFollower`);
      next(error);
    });
};

module.exports = getFollower;
