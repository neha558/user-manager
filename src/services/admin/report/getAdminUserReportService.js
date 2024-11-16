import { ServerException } from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';

import generateQuery from 'utils/generateQuery';

const generateIncludes = () => [
  {
    model: models.User,
    as: 'reportedUserDetail',
    required: true,
    attributes: [
      'firstName',
      'lastName',
      'userName',
      'email',
      'mobileNumber',
      'imageId',
      'profileBanner',
      'gender',
      'isSuspended',
      'createdAt',
    ],
    include: [
      {
        model: models.Address,
        though: 'addresses',
        as: 'address',
      },
    ],
  },
  {
    model: models.User,
    as: 'reportedByUserDetail',
    required: true,
    attributes: [
      'firstName',
      'lastName',
      'userName',
      'imageId',
      'profileBanner',
    ],
  },
];
const getAdminReportedUserService = ({ query }) => {
  const { limit = 20, offset = 0 } = query || {};
  const { order, where } = generateQuery(query);

  return new Promise((resolve, reject) => {
    logger.message(`Executing getAdminReportedUserService`);

    models.ReportedUser.findAndCountAll({
      include: generateIncludes(),
      limit,
      offset,
      order,
      where,
    })
      .then((result) => {
        logger.message(
          `Executing getAdminReportedUserService was successful`,
        );

        return resolve({
          pageInfo: { totalCount: result.count },
          data: result.rows,
        });
      })
      .catch((error) => {
        logger.message(
          `Uncaught error occurred status ${error?.stack || error}`,
        );
        return reject(
          new ServerException('Unable to get admin Poll', error),
        );
      });
  });
};

module.exports = getAdminReportedUserService;
