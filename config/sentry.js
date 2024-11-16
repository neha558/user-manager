const Sentry = require('@sentry/node');

const SentryLogger = (dsn) => {
  Sentry.init({ dsn });
  return Sentry;
};

export default SentryLogger;
