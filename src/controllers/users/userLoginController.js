import userService from 'services/user';
import logger from 'appConfig/logger';

const getUser = (req, res, next) => {
  logger.message(`Executing getUser`);
  userService
    .userLoginService(req.body)
    .then((user) => {
      logger.message(`Executing getUser was successful`);
      res.status(200).json(user);
    })
    .catch((error) => {
      logger.message(`Error while executing getUser`, 'error');
      next(error);
    });
};

export default getUser;
