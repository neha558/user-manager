import socialAuth from 'services/auth/socialAuth';
import logger from 'appConfig/logger';

const socialLogin = (req, res, next) => {
  logger.message(`Executing socialLogin`);
  socialAuth(req.body)
    .then((user) => {
      logger.message(`Executing socialLogin was successful`);
      res.status(200).json(user);
    })
    .catch((error) => {
      logger.message(`Error while executing socialLogin`, 'error');
      next(error);
    });
};

export default socialLogin;
