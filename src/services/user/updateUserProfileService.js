import {
  ServerException,
  BadRequestException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import bcrypt from 'bcrypt';
import { SALT_ROUND } from 'utils/constants';
import { cloneDeep } from 'lodash';
import { generateVerificationCode } from 'utils/verificationCodeUtil';
import generateOtp from 'utils/generateOtp';
import moment from 'moment';
import config from 'config';
import { Op } from 'sequelize';

import publishToKafka from '../../kafka/publisher/publishToKafka';

const updateSyncedContact = async (userId, requestedUserDetails) => {
  logger.message(`Executing updateSyncedContact`);
  await models.syncedContacts
    .update(
      {
        systemFirstName: requestedUserDetails.firstName,
        systemLastName: requestedUserDetails.lastName,
        contactUserName: requestedUserDetails.userName,
        contactNumber: requestedUserDetails.mobileNumber,
      },
      {
        where: { contactUserId: userId },
        returning: true,
      },
    )
    .then((fetchedUser) => {
      logger.message(`Executing updateSyncedContact successfully`);
      return fetchedUser;
    })
    .catch((error) => {
      logger.message(
        `Executing updateSyncedContact failure ${error}`,
      );
    });
};

const checkUserName = ({ userName }, userId) => {
  logger.message(`Executing checkUserName`);
  return new Promise((resolve, reject) => {
    if (!userName) {
      return resolve(false);
    }
    return models.Username.count({
      where: { userName, [Op.not]: [{ userId: [userId] }] },
    })
      .then((success) => {
        logger.message(`successfully Execute checkUserName`);
        const responseData = success !== 0;
        return resolve(responseData);
      })
      .catch((err) => {
        logger.message(`Error on Executing checkUserName${err}`);
        return reject(
          new BadRequestException('Username already exists.'),
        );
      });
  });
};

const saveUserName = (userData) => {
  logger.message(`Executing userNameSave`);
  return new Promise((resolve, reject) => {
    models.Username.create(userData)
      .then((success) => {
        logger.message(`successfully Execute checkUserName`);
        const responseData = success !== 0;
        return resolve(responseData);
      })
      .catch((err) => {
        logger.message(`Error on Executing checkUserName${err}`);
        return reject(
          new BadRequestException('Username already exists.'),
        );
      });
  });
};

const findUserAndCreateUpdateObject = (userDetails, userId) => {
  logger.message(`Executing findUserAndCreateUpdateObject`);
  const requestedUserDetails = cloneDeep(userDetails);
  return new Promise((resolve, reject) =>
    checkUserName(userDetails, userId)
      .then((checkUserNameObject) => {
        if (checkUserNameObject) {
          return reject(
            new BadRequestException('Username already exists.'),
          );
        }
        return models.User.findByPk(userId, { raw: true })
          .then(async (fetchedUser) => {
            const user = cloneDeep(fetchedUser);
            if (
              requestedUserDetails.email &&
              requestedUserDetails.email !== user.email
            ) {
              const currentDate = new Date();

              requestedUserDetails.emailVerificationCode = generateVerificationCode(
                moment(currentDate).add(
                  config.get('verificationLinkExpiryDuration'),
                  'hours',
                ),
                { email: requestedUserDetails.email },
              );

              requestedUserDetails.email = user.email;
            }
            if (
              requestedUserDetails.mobileNumber &&
              requestedUserDetails.mobileNumber !== user.mobileNumber
            ) {
              requestedUserDetails.otp = generateOtp();
              const currentDate = new Date();
              requestedUserDetails.otpExpiryTime = moment(
                currentDate,
              ).add(config.get('otpExpiryDuration'), 'minutes');

              requestedUserDetails.mobileNumber = user.mobileNumber;
            }
            if (requestedUserDetails.userName) {
              saveUserName({
                userId: user.userId,
                userName: requestedUserDetails.userName,
              })
                .then(() => {
                  logger.message(
                    `Executing saveUserName was successful`,
                  );
                  return resolve(requestedUserDetails);
                })
                .catch(() => {
                  logger.message(
                    `Executing saveUserName was successful`,
                  );
                  return reject(
                    new ServerException('Unable to save userName'),
                  );
                });
            }
            await updateSyncedContact(
              user.userId,
              requestedUserDetails,
            );
            return resolve(requestedUserDetails);
          })
          .catch((error) => {
            logger.message(
              `Error occurred while executing finding user ${
                error.stack || error
              }`,
            );
            return reject(
              new ServerException('Failed to update user profile'),
            );
          });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing finding user ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Failed to update user profile'),
        );
      }),
  );
};

const sendEmailOrSms = (updatedUser, requestedUserDetails) => {
  const notificationEvent = {};
  if (
    requestedUserDetails.email &&
    requestedUserDetails.email !== updatedUser.email
  ) {
    notificationEvent.type = 'EMAIL';
    notificationEvent.activityTime = updatedUser.updatedAt;
    notificationEvent.userId = updatedUser.userId;

    notificationEvent.emailOptions = {
      from: config.get('adminEmailId'),
      to: requestedUserDetails.email,
      subject: 'Public poll email verification',
      text: `Click on the link to verify your email with public poll ${config.get(
        'emailVerificationUrl',
      )}/${updatedUser.emailVerificationCode}`,
    };
  }
  if (
    requestedUserDetails.mobileNumber &&
    requestedUserDetails.mobileNumber !== updatedUser.mobileNumber
  ) {
    notificationEvent.type = 'SMS';
    notificationEvent.activityTime = updatedUser.updatedAt;
    notificationEvent.userId = updatedUser.userId;
    notificationEvent.smsOptions = {
      message: `${updatedUser.otp} is your one time password (OTP) for Public Poll.`,
      phoneNumber: requestedUserDetails.mobileNumber,
    };
  }
  if (Object.keys(notificationEvent).length > 0) {
    publishToKafka(
      'SMS-EMAIL-NOTIFICATION',
      notificationEvent,
      'CREATE',
    );
  }
};

const getPreviousImageId = async (params) => {
  logger.message(`Executing getPreviousImageId`);
  await models.User.findOne({
    attributes: ['imageId'],
    where: { userId: params.userId },
  })
    .then((user) => {
      logger.message(
        `Executing getPreviousImageId successful ${user}`,
      );
      publishToKafka('FILE-UPDATE', user?.imageId, 'DELETE');
    })
    .catch((error) => {
      logger.message(
        `Error on Executing getPreviousImageId ${error}`,
      );
    });
};

const checkEmailOrMobileExists = (
  { mobileNumber, email, userName },
  userId,
) => {
  logger.message(`Executing checkEmailOrMobile`);
  return new Promise((resolve, reject) => {
    logger.message(`Executing checkEmailOrMobile`);
    if (
      mobileNumber === undefined &&
      email === undefined &&
      userName === undefined
    ) {
      return resolve(false);
    }

    let where = {};
    let lableName;
    if (mobileNumber) {
      where = {
        mobileNumber: { [Op.iLike]: mobileNumber },
        [Op.not]: [{ userId: [userId] }],
      };
      lableName = 'Mobile Number';
    }
    if (email) {
      where = {
        email: { [Op.iLike]: email },
        [Op.not]: [{ userId: [userId] }],
      };

      lableName = 'Email';
    }
    if (userName) {
      where = {
        userName: { [Op.iLike]: userName },
        [Op.not]: [{ userId: [userId] }],
      };
      lableName = 'userName';
      return checkUserName({ userName }, userId)
        .then((success) => {
          logger.message(`successfully Execute checkEmailOrMobile`);
          return resolve(success);
        })
        .catch((error) => {
          logger.message(
            `Error on Executing checkEmailOrMobile${error}`,
          );
          return reject(
            new BadRequestException(`${lableName} already exists.`),
          );
        });
    }

    return models.User.count({
      where,
    })
      .then((success) => {
        logger.message(`successfully Execute checkEmailOrMobile`);
        const responseData = success !== 0;
        return resolve(responseData);
      })
      .catch((err) => {
        logger.message(`Error on Executing checkEmailOrMobile${err}`);
        return reject(
          new BadRequestException(`${lableName} already exists.`),
        );
      });
  });
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
const updateUserProfile = async (data, params) => {
  logger.message(`Executing updateUserProfile `);
  const dataObject = cloneDeep(data);
  if (dataObject.password) {
    dataObject.password = await bcrypt.hash(
      dataObject.password,
      SALT_ROUND,
    );
  }
  return new Promise((resolve, reject) => {
    logger.message(`Executing updateUserProfile `);
    return checkEmailOrMobileExists(dataObject, params.userId).then(
      (success) => {
        logger.message(`Executing updateUserProfile ${success}`);
        if (success) {
          let fieldName;
          if (dataObject.mobileNumber) {
            fieldName = 'Mobile Number';
          } else if (dataObject.email) {
            fieldName = 'Email';
          } else {
            fieldName = 'UserName';
          }
          return reject(
            new BadRequestException(`${fieldName} already exists.`),
          );
        }
        findUserAndCreateUpdateObject(dataObject, params.userId)
          .then((userDetails) => {
            const requestedUserDetails = cloneDeep(userDetails);

            if (dataObject?.imageId === null) {
              getPreviousImageId(params);
              requestedUserDetails.imageId =
                userDetails?.imageId == null
                  ? null
                  : userDetails?.imageId;
            }

            models.User.update(
              { ...requestedUserDetails, isNewLogin: false },
              {
                where: { userId: params.userId },
                returning: true,
              },
            )
              .then((updatedUser) => {
                logger.message(
                  `Executing updateUserProfile was successful`,
                );
                publishToKafka(
                  'USER-NOTIFICATION',
                  updatedUser[1][0],
                  'UPDATE',
                );
                sendEmailOrSms(updatedUser[1][0], dataObject);
                return resolve();
              })
              .catch((error) => {
                logger.message(
                  `Error occurred while executing updateUserProfile ${
                    error?.stack || error
                  }`,
                );
                return reject(
                  new ServerException('Unable to updateUserProfile'),
                );
              });
          })
          .catch((error) => {
            if (error?.description) {
              logger.message(
                `userName must be unique ${error?.description}`,
              );
              return reject(
                new BadRequestException(`${error?.description}`),
              );
            }
            logger.message(
              `Error occurred while executing updateUserProfile ${
                error?.stack || error
              }`,
            );
            return reject(
              new ServerException('Failed to update user profile'),
            );
          });
        return resolve(success);
      },
      (error) => {
        logger.message(
          `Error on Executing updateUserProfile ${error}`,
        );
        return reject(
          new ServerException('Failed to update user profile'),
        );
      },
    );
  });
};

export default updateUserProfile;
