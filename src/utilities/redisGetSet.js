import logger from 'appConfig/logger';
import redisClient from 'appConfig/connectRedis';

const setDataInRedis = async (key, contactList) => {
  const pipeline = redisClient.pipeline();
  pipeline.del(key);
  contactList.forEach((value, index) => {
    pipeline.zadd(key, index, JSON.stringify(value));
  });

  const setDataResponse = await pipeline.exec((err, results) => {
    if (err) {
      logger.message(`error on executing setDataInRedis ${err}`);
      return err;
    }
    logger.message(`redis results ${results}`);
    return true;
  });
  return setDataResponse;
};

const getDataFromRedis = async (key, start, end) => {
  const lists = await redisClient
    .zrange(key, start, end)
    .then((res) => res);

  return lists;
};

const deleteKey = async (key) => {
  await redisClient.del(key);
};

export { setDataInRedis, getDataFromRedis, deleteKey };
