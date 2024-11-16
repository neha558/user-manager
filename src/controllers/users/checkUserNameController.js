import userService from 'services/user';
import logger from 'appConfig/logger';

const checkUserName = (req, res, next) => {
  logger.message(`Executing checkUserName`);
  const userId = req.body.user?.userId ? req.body.user.userId : null;
  userService
    .checkUserNameService(userId, req.params.userName)
    .then((isUserNameTaken) => {
      logger.message(`Executing checkUserName was successful`);
      return res.status(200).json({ isUserNameTaken });
    })
    .catch((error) => {
      logger.message(`Error while executing checkUserName${error}`);
      next(error);
    });
};

export default checkUserName;
