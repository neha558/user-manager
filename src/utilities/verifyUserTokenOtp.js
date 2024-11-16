import models from 'models';

const verifyUserTokenOtp = (credentials) => {
  let whereCondition = {};
  if (credentials.token) {
    whereCondition = {
      where: { forgotPasswordToken: credentials.token },
    };
  } else {
    whereCondition = {
      where: { otp: credentials.otp },
    };
  }
  return models.User.findOne(whereCondition);
};
export default verifyUserTokenOtp;
