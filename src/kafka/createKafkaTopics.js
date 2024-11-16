import kafka from 'kafka-node';
import logger from 'appConfig/logger';
import config from 'config';

const client = new kafka.KafkaClient({
  kafkaHost: config.get('kafkaHost'),
});

const topics = [
  {
    topic: 'FILE-UPDATE',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'USER-NOTIFICATION',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'FOLLOWER-UPDATES',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'SMS-EMAIL-NOTIFICATION',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'UPDATE-ADDRESS-TOPIC',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'BLOCK-USER-UPDATES',
    partitions: 1,
    replicationFactor: 1,
  },
];

const admin = new kafka.Admin(client);
const createKafkaTopics = () => {
  logger.message(`Creating topics ${JSON.stringify(topics)}`);
  admin.createTopics(topics, (error) => {
    if (error) {
      logger.message(
        `Error occurred while creating a topic ${
          error?.stack || error
        }`,
        'error',
      );
      return;
    }
    logger.message(`Topics created / already created`);
  });
};

export default createKafkaTopics;
