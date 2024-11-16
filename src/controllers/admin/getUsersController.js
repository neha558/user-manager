import adminService from 'services/admin';
import logger from 'appConfig/logger';

const getUser = (req, res, next) => {
  logger.message(`Executing admin getUser`);

  adminService
    .getUserService(req.query)
    .then((user) => {
      logger.message(`Executing admin getUser was successful`);
      return res.status(200).json(user);
    })
    .catch((error) => {
      logger.message(`Error while executing admin getUser`, 'error');
      return next(error);
    });
};

export default getUser;
