import contactsService from 'services/contacts';
import logger from 'appConfig/logger';

const createSyncContactController = (req, res, next) => {
  logger.message(`Executing createTemplate controller`);
  return contactsService
    .createSyncContactService(req.body)
    .then(() => {
      logger.message(
        `Executing createSyncContactController was successful`,
      );
      res.status(200).send();
    })
    .catch((error) => {
      logger.message(
        `Error while executing createSyncContactController`,
      );
      return next(error);
    });
};

module.exports = createSyncContactController;
