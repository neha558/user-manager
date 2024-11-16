import kafka from 'kafka-node';
import logger from 'appConfig/logger';
import config from 'config';

const client = new kafka.KafkaClient({
  kafkaHost: config.get('kafkaHost'),
});

const publishToKafka = (topic, entityDetails, action) => {
  try {
    /**
     * Kafka Producer Configuration
     */
    const { Producer } = kafka;
    const producer = new Producer(client);
    producer.on('ready', () => {
      logger.message(`Kafka producer is READY`);
    });
    producer.on('error', (error) => {
      logger.message(error);
      logger.message(
        `[kafka-producer -> ${topic}]: connection error`,
      );
      throw error;
    });

    const eventPayload = [
      {
        topic,
        messages: JSON.stringify({
          data: entityDetails,
          action,
        }),
      },
    ];
    producer.send(eventPayload, (error) => {
      if (error) {
        logger.message(
          `[kafka-producer -> ${topic}]: connection error`,
        );
      }
      logger.message(
        `Response from kafka: ${error?.stack || error}`,
        'error',
      );
    });
  } catch (error) {
    logger.message(
      `Error publishing message to kafka: ${error?.stack || error}`,
    );
  }
};

export default publishToKafka;
