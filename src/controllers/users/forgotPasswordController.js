import userService from 'services/user';
import logger from 'appConfig/logger';

const forgotPassword = (req, res, next) => {
  logger.message(`Executing forgotPassword`);
  userService
    .forgotPasswordService(req.body)
    .then((success) => {
      logger.message(`Executing forgotPassword was successful`);
      res.status(200).json(success);
    })
    .catch((error) => {
      logger.message(`Error while executing forgotPassword`, 'error');
      next(error);
    });
};

export default forgotPassword;
