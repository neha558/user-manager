import userService from 'services/user';
import logger from 'appConfig/logger';

const getUserProfile = (req, res, next) => {
  logger.message(`Executing getUserProfile`);
  userService
    .getProfileService(req.body.user.userId)
    .then((user) => {
      logger.message(`Executing getUserProfile was successful`);
      return res.status(200).json(user);
    })
    .catch((error) => {
      logger.message(`Error while executing getUserProfile`, 'error');
      return next(error);
    });
};
export default getUserProfile;
