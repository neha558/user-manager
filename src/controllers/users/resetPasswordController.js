import userService from 'services/user';
import logger from 'appConfig/logger';

const resetPassword = (req, res, next) => {
  logger.message(`Executing resetPassword`);
  userService
    .resetPasswordService(req.body)
    .then(() => {
      logger.message(`Executing resetPassword was successful`);
      res.status(204).json();
    })
    .catch((error) => {
      logger.message(`Error while executing resetPassword`, 'error');
      next(error);
    });
};

export default resetPassword;
