import logger from 'appConfig/logger';
import {
  UnauthorizedException,
  BadRequestException,
} from 'utils/exceptions';

const authorizedRoles = (roles) => (req, res, next) => {
  if (!roles) {
    throw new UnauthorizedException(new Error('Unauthorized user'));
  }

  let finalRoles = roles || [];

  if (typeof roles === 'string') {
    finalRoles = [roles];
  }

  logger.message(`executing authorizedRoles`);

  const { user } = req.body;
  const { roles: userRoles = [] } = user;

  if (!user == null) {
    throw new BadRequestException('User not found');
  }

  try {
    let allowAccess = false;

    finalRoles.forEach((role) => {
      allowAccess = allowAccess || userRoles.includes(role);
    });

    if (!allowAccess) {
      logger.message(`Unauthorized user`);

      throw new UnauthorizedException(new Error('Unauthorized user'));
    }

    next();
  } catch (error) {
    logger.message(
      `occurring error authorizedRoles${error?.stack || error}`,
    );

    throw new UnauthorizedException(error);
  }
};

module.exports = authorizedRoles;
