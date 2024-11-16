import jwt from 'jsonwebtoken';
import config from 'config';
import { UnauthorizedException } from 'utils/exceptions';

const decodeToken = (req, res, next) => {
  const token = req.headers.authorization;

  try {
    if (token !== undefined) {
      const user = jwt.verify(token, config.get('TOKEN_SECRET'));
      req.body = { ...req.body, ...user };
    }
    next();
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
module.exports = decodeToken;
