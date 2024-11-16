import { ServerException } from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import { Op } from 'sequelize';

const checkUserNameService = (userId, userName) => {
  logger.message(`Executing checkUserNameService`);
  logger.message(
    `checking checkUserNameService for userId ${userId} and userName ${userName}`,
  );
  let where;
  if (userId) {
    where = { userName, [Op.not]: [{ userId: [userId] }] };
  } else {
    where = { userName };
  }
  return new Promise((resolve, reject) => {
    models.Username.count({
      where,
    })
      .then((userNameResponse) => {
        logger.message(
          `Executing checkUserNameService was successful`,
        );
        const responseData = userNameResponse !== 0;
        return resolve(responseData);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing checkUserNameService ${error}`,
        );
        return reject(
          new ServerException('Unable to checkUserNameService'),
        );
      });
  });
};
module.exports = checkUserNameService;
