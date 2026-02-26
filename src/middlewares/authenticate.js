import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  console.log('temporary');
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw createHttpError(401, 'There is no accessToken');
  }

  const session = await Session.findOne({
    accessToken: req.cookies.accessToken,
  });

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    throw createHttpError(401, 'AccessToken is expired');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'There is no such user');
  }
  req.user = user;
  next();
};
