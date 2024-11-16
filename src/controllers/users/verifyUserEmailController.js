import userService from 'services/user';
import logger from 'appConfig/logger';

const verifyUserEmail = (req, res, next) => {
  logger.message(`Executing verifyUserEmail controller`);
  userService
    .verifyUserEmailService(req.params.verificationCode)
    .then(() => {
      logger.message(`Executing verifyUserEmail was successful`);
      res.status(204).json();
    })
    .catch((error) => {
      logger.message(
        `Error while executing verifyUserEmail`,
        'error',
      );
      next(error);
    });
};

export default verifyUserEmail;
