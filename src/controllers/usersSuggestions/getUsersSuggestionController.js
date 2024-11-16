import SuggestionService from 'services/usersSuggestions';
import logger from 'appConfig/logger';

const getUsersSuggestion = (req, res, next) => {
  logger.message(`Executing getUsersSuggestion`);
  SuggestionService.getUsersSuggestionService(req.query, req.body)
    .then((user) => {
      logger.message(`Executing getUsersSuggestion was successful`);
      return res.status(200).json(user);
    })
    .catch((error) => {
      logger.message(
        `Error while executing getUsersSuggestion`,
        'error',
      );
      return next(error);
    });
};

export default getUsersSuggestion;
