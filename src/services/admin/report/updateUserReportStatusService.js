import { ServerException } from 'utils/exceptions/index';
import models from 'models';
import ResourceNotFoundException from 'utils/exceptions/ResourceNotFoundException';
import logger from 'appConfig/logger';

const updateReportedUserStatusService = ({ params, body }) =>
  new Promise((resolve, reject) => {
    logger.message(`Executing updateUserStatusService`);

    models.ReportedUser.update(
      { read: body.read },
      {
        where: { reportId: +params.id },
        returning: true,
      },
    )
      .then((updatedUserResponse) => {
        if (updatedUserResponse[0] !== 0) {
          return resolve({
            message: 'Reported User status updated successfully',
            updateUserResponse: updatedUserResponse[1][0],
          });
        }

        logger.message(`reported user id ${params.id} not found`);

        return reject(
          new ResourceNotFoundException('Reported User not found'),
        );
      })
      .catch((error) => {
        logger.message(
          `Uncaught error occurred status ${error?.stack || error}`,
        );
        return reject(
          new ServerException('Reported user update failed.', error),
        );
      });
  });

module.exports = updateReportedUserStatusService;
