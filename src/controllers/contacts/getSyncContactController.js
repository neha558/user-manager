import contactsService from 'services/contacts';
import logger from 'appConfig/logger';

const getSyncContactController = (req, res, next) => {
  logger.message(`Executing getSyncContactController`);
  return contactsService
    .getSyncContactService(req)
    .then((contacts) => {
      logger.message(
        `Executing getSyncContactController was successful`,
      );
      res.status(200).json(contacts);
    })
    .catch((error) => {
      logger.message(
        `Error while executing getSyncContactController`,
      );
      next(error);
    });
};

module.exports = getSyncContactController;
