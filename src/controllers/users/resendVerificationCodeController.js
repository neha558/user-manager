import userService from 'services/user';
import logger from 'appConfig/logger';

const resendVerificationCodeController = (req, res, next) => {
  logger.message(`Executing resendVerificationCode controller`);
  const { email, mobileNumber } = req.body;
  userService
    .resendVerificationCodeService({ email, mobileNumber })
    .then((userDetail) => {
      logger.message(
        `Executing resendVerificationCode was successful`,
      );
      res.status(200).json(userDetail);
    })
    .catch((error) => {
      logger.message(
        `Error while executing resendVerificationCode`,
        'error',
      );
      next(error);
    });
};

export default resendVerificationCodeController;
