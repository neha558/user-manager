import followerService from 'services/follower';
import logger from 'appConfig/logger';

const unfollow = (req, res, next) => {
  logger.message(`Executing unfollow controller`);
  return followerService
    .unfollowService(req.body)
    .then((followId) => {
      logger.message(`Executing unfollow was successful`);
      res.status(201).json(followId);
    })
    .catch((error) => {
      logger.message(`Error while executing unfollow`);
      return next(error);
    });
};

module.exports = unfollow;
