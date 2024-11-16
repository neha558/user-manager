import userService from 'services/user';
import logger from 'appConfig/logger';

const updateUserProfile = (req, res, next) => {
  logger.message(`Executing updateUserProfile controller`);
  userService
    .updateUserProfile(req.body, req.body.user)
    .then((user) => {
      logger.message(`Executing updateUserProfile was successful`);
      res.status(204).json(user);
    })
    .catch((error) => {
      logger.message(
        `Error while executing updateUserProfile`,
        'error',
      );
      next(error);
    });
};

export default updateUserProfile;
