import { ServerException } from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import map from 'lodash/map';

import { removeNullFromObject } from 'utils/commons';
import { Op } from 'sequelize';
import generateQuery from 'utils/generateQuery';

const modifyUsers = (users) => {
  logger.message(`Executing modifyUsers`);
  const nullRemovedUsers = removeNullFromObject(users);

  return map(nullRemovedUsers, (user) => {
    const newUser = { ...user };

    delete newUser.password;
    delete newUser.emailVerificationCode;
    delete newUser.forgotPasswordToken;
    newUser.fullName = `${user.firstName} ${user.lastName}`;

    return newUser;
  });
};

const generateIncludeWhere = (cityName, stateName) => {
  let includeWhere;
  if (cityName) {
    includeWhere = {
      city: { [Op.like]: cityName },
    };
  }
  if (stateName) {
    includeWhere = {
      ...includeWhere,
      state: { [Op.like]: stateName },
    };
  }
  return includeWhere;
};
/**
 *
 * @param {
 * "name":string
 * "UserType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */

const getUserService = (query) => {
  const { limit, offset, cityName, stateName } = query;
  const { order, where } = generateQuery(query);
  logger.message(`Executing admin getUserService`);

  return new Promise((resolve, reject) => {
    const attributes = [
      'userId',
      'firstName',
      'lastName',
      'userName',
      'mobileNumber',
      'email',
      'gender',
      'imageId',
      'createdAt',
      'isSuspended',
    ];
    const includeWhere = generateIncludeWhere(cityName, stateName);

    models.User.findAndCountAll({
      attributes,
      offset,
      limit,
      order,
      where,
      include: [
        {
          model: models.Address,
          though: 'addresses',
          where: includeWhere,
          as: 'address',
        },
      ],
    })
      .then((result) => {
        logger.message(`Executing admin getUserService successfully`);

        return resolve({
          pageInfo: { totalCount: result.count },
          data: modifyUsers(result.rows),
        });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing admin getUserService ${
            error?.stack || error
          }`,
          '',
        );
        return reject(new ServerException('Unable to get user'));
      });
  });
};

module.exports = getUserService;
