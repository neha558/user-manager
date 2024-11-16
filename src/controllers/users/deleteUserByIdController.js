import logger from 'appConfig/logger';
import userService from 'services/user';

const deleteUserById = (req, res, next) => {
  logger.message(`Executing deleteUserById`);
  userService
    .deleteUserByIdService(req.params)
    .then((userResponse) => {
      logger.message(`Executing deleteUserById was successful`);
      res.status(204).json(userResponse);
    })
    .catch((error) => {
      logger.message(`Error while executing deleteUserById`, 'error');
      next(error);
    });
};

export default deleteUserById;
