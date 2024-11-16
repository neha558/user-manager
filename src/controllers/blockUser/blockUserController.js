import blockUserService from 'services/blockUser';
import logger from 'appConfig/logger';

const block = (req, res, next) => {
  logger.message(`Executing BlockUserService controller`);
  return blockUserService
    .blockUserService(
      req.body.blockUserId,
      req.body.user.userId,
      req.body.action,
    )
    .then((serviceResponse) => {
      logger.message(`Executing BlockUserService is successful`);
      res.status(201).json(serviceResponse);
    })
    .catch((error) => {
      logger.message(
        `Error while executing BlockUserService in BlockUserHandleController`,
      );
      return next(error);
    });
};

module.exports = block;
