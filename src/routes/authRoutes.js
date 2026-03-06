import { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register user
 *     description: Creates a new user account. Authentication cookies are set in response headers.


 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 32
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: "123456"

 *
 *     responses:
 *       201:
 *         description: New user is created
 *         headers:
 *           Set-Cookie:
 *             description: Sets accessToken and refreshToken HTTP-only cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               required:
 *                 - message
 *                 - user
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     avatar:
 *                       type: string
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                     theme:
 *                       type: string
 *                       enum:
 *                         - girl
 *                         - boy
 *                         - neutral
 *
 *               additionalProperties: false
 *
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: string
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: string
 */

router.post(
  '/auth/register',
  celebrate(registerUserValidationSchema),
  registerUser,
);

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Checks if there is a user with such email in the DB. Checks if the password is valid. Deletes old session, creates new session - assigns to cookies accessToken and refreshtToken.  and returns the user object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Returns the user object
 *         headers:
 *           Set-Cookie:
 *             description: Sets accessToken and refreshToken HTTP-only cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - _id
 *                 - email
 *                 - theme
 *                 - createdAt
 *                 - updatedAt
 *                 - name
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                   maxLength: 32
 *                 email:
 *                   type: string
 *                   format: email
 *                 avatar:
 *                   type: string
 *                 theme:
 *                   type: string
 *                   enum:
 *                     - boy
 *                     - girl
 *                     - neutral
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *               additionalProperties: false
 *       401:
 *         description: Returns when User doesn't exist or password is wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *                 - code
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: string
 *
 */

router.post('/auth/login', celebrate(loginUserValidationSchema), loginUser);

/**
 * @swagger
 *
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: refresh User session
 *     description: Validates sessionId and refreshToken cookies and refreshes the session if the token is valid.
 *
 *     responses:
 *       200:
 *         description: Successfully refreshed the session and issued new authentication cookies.
 *         headers:
 *           Set-Cookie:
 *             description: Sets sessionId, accessToken and refreshToken HTTP-only cookies.
 *             schema:
 *               type: string
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session refreshed
 *       401:
 *         description: Unauthorised. Session not found or refreshToken is expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *             expamples:
 *                SESSION_NOT_FOUND:
 *                  value:
 *                    message: Session not found
 *                REFRESH_TOKEN_IS_EXPIRED:
 *                  value:
 *                    message: refresh token is expired
 */
router.post('/auth/refresh', authenticate, refreshUserSession);
router.post('/auth/logout', authenticate, logoutUser);
// router.post(
//   '/auth/request-reset-email',
//   celebrate(RequestResetEmailSchema),
//   requestResetEmail,
//   //   перевірить email користувача,
//   // згенерує JWT-токен,
//   // відправить лист із посиланням для скидання паролю.
// );
// router.post(
//   '/auth/reset-password',
//   //   прийматиме токен і новий пароль,
//   // перевірятиме токен,
//   // оновлюватиме пароль користувача.
// );

export default router;
