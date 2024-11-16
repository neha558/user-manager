import userService from 'services/user';
import logger from 'appConfig/logger';

const createUser = (req, res, next) => {
  logger.message(`Executing createUser controller`);
  if (req.body?.email) {
    req.body.email.toLowerCase();
  }
  userService
    .createUserService(req.body)
    .then((user) => {
      logger.message(`Executing createUser was successful`);
      res.status(201).json(user);
    })
    .catch((error) => {
      logger.message(`Error while executing createUser`, 'error');
      next(error);
    });
};

export default createUser;
