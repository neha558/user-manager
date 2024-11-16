const generateException = require('./generateException');

class ServerException extends Error {
  constructor(exception) {
    super();
    generateException(this, 500, 'Request Timed out', exception);
  }
}

module.exports = ServerException;
