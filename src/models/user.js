import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const user = sequelize.define(
    'users',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      followers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      followings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          message: 'Username already exists.',
        },
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      twoFactorAuthentication: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      forgotPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verifyByEmail: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verifyByMobile: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      otpExpiryTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailVerificationCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileBanner: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
        defaultValue: 'MALE',
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interests: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebookId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      appleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      areTermsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isNewLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isSuspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      freezeTableName: true,
      instanceMethods: {
        generateHash(password) {
          return bcrypt.hash(password, bcrypt.genSaltSync(8));
        },
        validPassword(password) {
          return bcrypt.compare(password, this.password);
        },
      },
    },
  );
  return user;
};