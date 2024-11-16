import models from 'models';

const checkUserExists = (credentials) => {
  let whereCondition = {};
  const attributes = [
    'userId',
    'firstName',
    'lastName',
    'email',
    'userName',
    'mobileNumber',
    'password',
    'googleId',
    'facebookId',
    'appleId',
    'verifyByEmail',
    'verifyByMobile',
    'isSuspended',
  ];
  if (credentials.userName) {
    whereCondition = {
      attributes,
      where: { userName: credentials.userName },
    };
  }
  if (credentials.email) {
    whereCondition = {
      attributes,
      where: { email: credentials.email },
    };
  }
  if (credentials.mobileNumber) {
    whereCondition = {
      attributes,
      where: { mobileNumber: credentials.mobileNumber },
    };
  }
  return models.User.findOne(whereCondition);
};
export default checkUserExists;
