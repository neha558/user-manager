import redis from 'ioredis';
import config from 'config';
import logger from 'appConfig/logger';

const redisClient = redis.createClient({
  port: config.get('redisPort'),
  host: config.get('redisHost'),
  password: config.get('redisPassword'),
});

redisClient.on('error', (error) => {
  logger.message(`Error on redis connection ${error}`);
});

export default redisClient;
