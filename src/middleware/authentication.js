import jwt from 'jsonwebtoken';
import config from 'config';
import {
  UnauthorizedException,
  BadRequestException,
} from 'utils/exceptions';

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token == null)
    throw new BadRequestException('Please provide token');
  try {
    const user = jwt.verify(token, config.get('TOKEN_SECRET'));
    req.body = { ...req.body, ...user };
    next();
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
module.exports = authenticateToken;
