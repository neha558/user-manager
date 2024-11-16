import adminService from 'services/admin';
import logger from 'appConfig/logger';

const suspendUser = (req, res, next) => {
  logger.message(`Executing suspendUser`);

  adminService
    .suspendUserService(req)
    .then(() => {
      logger.message(`Executing suspendUser was successful`);
      return res.status(204).send();
    })
    .catch((error) => {
      logger.message(`Error while executing suspendUser`, 'error');
      return next(error);
    });
};

export default suspendUser;
