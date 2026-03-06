import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
import { Session } from '../models/session.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
// import jwt from 'jsonwebtoken';
// import { sendEmail } from '../utils/sendEmail.js';

export const registerUser = async (req, res, next) => {
  console.log('The user is created');
  const { email, password } = req.body;

  const isExistingUser = await User.findOne({ email });
  if (isExistingUser) {
    throw createHttpError(
      409,
      `Email ${email} is already in use. Please use another`,
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email: email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json({
    message: `New user with email ${email} is created`,
    newUser,
  });
};

export const loginUser = async (req, res, next) => {
  console.log('I see the route');
  const { email, password } = req.body;
  const isValidUser = await User.findOne({ email });
  if (!isValidUser) {
    throw createHttpError(401, 'Wrong credentials');
  }

  const isValidPassword = await bcrypt.compare(password, isValidUser.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Wrong credentials');
  }

  await Session.deleteOne(isValidUser._id);

  const newSession = await createSession(isValidUser._id);
  setSessionCookies(res, newSession);

  res.status(200).json(isValidUser);
};

export const refreshUserSession = async (req, res) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

export const logoutUser = async (req, res, next) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// export const requestResetEmail = async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email: email });
//   if (!user) {
//     return res.status(200).json({
//       message: 'If this email exists, a reset link has been sent',
//     });
//   }

//   const resetToken = jwt.sign(
//     { sub: user._id, email },
//     process.env.JWT_SECRET,
//     { expiresIn: '15m' },
//   );

//   try {
//     await sendEmail({
//       from: process.env.SMTP_FROM,
//       to: email,
//       subject: 'Reset your password',
//       html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
//     });
//   } catch (err) {
//     // throw createHttpError(
//     //   500,
//     //   'Failed to send the email, please try again later.',
//     // );
//     console.error('MAIL ERROR:', {
//       message: err.message,
//       code: err.code,
//       response: err.response,
//       responseCode: err.responseCode,
//       command: err.command,
//     });
//     throw err;
//   }

//   res.status(200).json({
//     message: 'If this email exists, a reset link has been sent',
//   });
// };
