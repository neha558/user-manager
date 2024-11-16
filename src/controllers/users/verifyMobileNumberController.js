import userService from 'services/user';
import logger from 'appConfig/logger';

const verifyMobileNumberController = (req, res, next) => {
  logger.message(`Executing verifyMobileNumber controller`);
  const { userId, otp, mobileNumber } = req.body;
  userService
    .verifyMobileNumberService(userId, otp, mobileNumber)
    .then((success) => {
      logger.message(`Executing verifyMobileNumber was successful`);
      res.status(200).json(success);
    })
    .catch((error) => {
      logger.message(
        `Error while executing verifyMobileNumber`,
        'error',
      );
      next(error);
    });
};

export default verifyMobileNumberController;
