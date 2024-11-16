const generateException = require('./generateException');

class ForbiddenException extends Error {
  constructor(exception) {
    super();
    generateException(this, 403, 'Forbidden', exception);
  }
}

module.exports = ForbiddenException;
