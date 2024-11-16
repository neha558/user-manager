import nodemailer from 'nodemailer';
import config from 'config';
import logger from 'appConfig/logger';

const smtp = config.get('smtp');
const transporter = nodemailer.createTransport(smtp);

const sendEmailNotification = (emailOptions) => {
  transporter
    .sendMail(emailOptions)
    .then((info) => {
      logger.message(`Email sent to ${info.envelope.to}`);
    })
    .catch((error) => {
      logger.message(
        `Error occurred while sending email ${error?.stack || error}`,
      );
    });
};
export default sendEmailNotification;
