/* eslint-disable no-restricted-properties */

const generateOtp = (length = 6) =>
  Math.floor(
    Math.pow(10, length - 1) +
      Math.random() *
        (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
  );

export default generateOtp;
