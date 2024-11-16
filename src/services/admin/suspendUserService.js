import {
  ServerException,
  ResourceNotFoundException,
  BadRequestException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import config from 'config';
import publishToKafka from '../../kafka/publisher/publishToKafka';
import userSuspendedTemplate from '../../templates/userSuspendedTemplate';

const sendEmailOrSms = (user) => {
  let notificationEvent = {};
  const statusMessage =
    user.isSuspended === true ? 'Deactivated' : 'Activated';
  const emailNotification = {
    type: 'EMAIL',
    activityTime: new Date(),
    userId: user.userId,
    emailOptions: {
      from: config.get('adminEmailId'),
      to: user.email,
      subject: 'Public Poll Profile Update',
      html: userSuspendedTemplate(
        statusMessage,
        config.get('IMAGE_URL'),
      ),
    },
  };

  const smsNotification = {
    type: 'SMS',
    activityTime: new Date(),
    userId: user.userId,
    smsOptions: {
      message: `Your Profile has been ${statusMessage} by admin, please contact support on Public Poll`,
      phoneNumber: user.mobileNumber,
    },
  };

  if (user.email) {
    notificationEvent = emailNotification;
  } else {
    notificationEvent = smsNotification;
  }
  publishToKafka(
    'SMS-EMAIL-NOTIFICATION',
    notificationEvent,
    'CREATE',
  );
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

const suspendUserService = (req) => {
  logger.message(`Executing suspendUserService`);
  const io = req.app.get('io');
  return new Promise((resolve, reject) => {
    const { body, params } = req;
    models.User.findOne({
      where: { userId: params.userId },
    })
      .then((user) => {
        if (user) {
          if (user.isSuspended === body.isSuspended) {
            logger.message(
              `Executing suspendUserService user already ${
                user.isSuspended ? 'suspended' : 'activated'
              }`,
            );
            return reject(
              new BadRequestException(
                `Account has already ${
                  user.isSuspended ? 'suspended' : 'activated'
                }`,
              ),
            );
          }
          // eslint-disable-next-line no-param-reassign
          user.isSuspended = body.isSuspended;
          user.save();
          publishToKafka('USER-NOTIFICATION', user, 'UPDATE');
          io.to(`session-of-${user.userId}`).emit(
            'user-status',
            JSON.stringify({ isSuspended: true }),
          );
          sendEmailOrSms(user);
          logger.message(`Executing suspendUserService successfully`);
          return resolve();
        }
        logger.message(
          `Executing suspendUserService Unable to find user`,
        );
        return reject(
          new ResourceNotFoundException('Unable to find user'),
        );
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing suspendUserService ${
            error?.stack || error
          }`,
        );
        return reject(new ServerException('Unable to suspend user'));
      });
  });
};

module.exports = suspendUserService;
