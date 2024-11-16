import { ServerException } from 'utils/exceptions/index';
import models from 'models';
import ResourceNotFoundException from 'utils/exceptions/ResourceNotFoundException';
import logger from 'appConfig/logger';
import { paginateData } from 'utils/commons';
import {
  setDataInRedis,
  getDataFromRedis,
  deleteKey,
} from 'utils/redisGetSet';

const getSyncContactService = async (req) => {
  logger.message(`Executing getSyncContactService`);
  const { body, query } = req;
  const { recordLimit, cursor } = query;
  const limit = recordLimit ? Number(recordLimit) + 1 : 500;
  const afterCursor = Number(cursor) ? Number(cursor) : 0;

  let redisLimit = 0;
  if (afterCursor >= 0) {
    redisLimit = Number(limit) + Number(afterCursor);
  }

  const redisKey = `contacts:${body.user.userId}`;
  try {
    const getRedisResponse = await getDataFromRedis(
      redisKey,
      afterCursor,
      redisLimit - 1,
    );
    if (getRedisResponse.length && afterCursor) {
      const resultLists = getRedisResponse.map((contact) =>
        JSON.parse(contact),
      );
      return Promise.resolve(
        paginateData(resultLists, limit, afterCursor),
      );
    }
    return models.syncedContacts
      .findAll({ where: { userId: body.user.userId } })
      .then(async (contactsObject) => {
        if (contactsObject) {
          logger.message(
            `Executing getSyncContactService was successful`,
          );
          if (contactsObject.length) {
            await deleteKey(redisKey);
            await setDataInRedis(redisKey, contactsObject);
            const getRedisResponseObject = await getDataFromRedis(
              redisKey,
              afterCursor,
              redisLimit - 1,
            );
            if (getRedisResponseObject.length) {
              const resultLists = getRedisResponseObject.map(
                (contact) => JSON.parse(contact),
              );
              return Promise.resolve(
                paginateData(resultLists, limit, afterCursor),
              );
            }
            return Promise.resolve(
              paginateData(contactsObject, limit, afterCursor),
            );
          }
          return Promise.resolve(
            paginateData(contactsObject, limit, afterCursor),
          );
        }
        return Promise.reject(
          new ResourceNotFoundException(
            'getSyncContactService Not Found',
          ),
        );
      })
      .catch((error) => {
        logger.message(error);
        logger.message(
          `Uncaught error occurred status getSyncContactService ${
            error?.stack || error
          }`,
        );
        return Promise.reject(
          new ServerException('Unable to getSyncContactService'),
        );
      });
  } catch (error) {
    logger.message(`Something went wrong ${error?.stack || error}`);
    return Promise.reject(
      new ServerException(`Something went wrong `),
    );
  }
};

module.exports = getSyncContactService;
