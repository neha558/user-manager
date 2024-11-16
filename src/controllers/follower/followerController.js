import followerService from 'services/follower';
import logger from 'appConfig/logger';

const follower = (req, res, next) => {
  logger.message(`Executing follower controller`);
  return followerService
    .followService(req.body)
    .then((followId) => {
      logger.message(`Executing follower was successful`);
      res.status(201).json(followId);
    })
    .catch((error) => {
      logger.message(`Error while executing follower`);
      return next(error);
    });
};

module.exports = follower;
