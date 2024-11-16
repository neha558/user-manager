import userService from 'services/user';
import logger from 'appConfig/logger';

const getUser = (req, res, next) => {
  logger.message(`Executing getUser`);
  userService
    .getUserService(req.query, req.body.user.userId)
    .then((user) => {
      logger.message(`Executing getUser was successful`);
      return res.status(200).json(user);
    })
    .catch((error) => {
      logger.message(`Error while executing getUser`, 'error');
      return next(error);
    });
};

export default getUser;
