import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Field } from '../enums';
import { Users } from '../mongobd/user';
import { IUser } from '../dto/dto';

export const userUpdateValidationRules = () => {
  return [
    body().custom((req) => {
      return (req.email || req.username) && Object.keys(req).length <= 1
        ? Promise.resolve()
        : Promise.reject('Not found');
    }),
    body(Field.USERNAME)
      .isLength({ min: 6, max: 20 })
      .withMessage('Username must be between 6 and 20 letters long')
      .optional({ nullable: true }),
    body(Field.EMAIL)
      .isEmail()
      .optional({ nullable: true })
      .custom((email: string, { req }) => {
        return Users.findOne({ email }).then((userDoc: IUser) => {
          if (userDoc)
            return Promise.reject(
              'Email already A user with such data already exist',
            );

          return Promise.resolve();
        });
      }),
  ];
};

export const userValidationRules = () => {
  return [
    body(Field.NAME).isLength({ min: 5 }).notEmpty(),
    body(Field.USERNAME).isLength({ min: 5 }).notEmpty(),
    body(Field.EMAIL).isEmail().notEmpty(),
  ];
};

export const bitcoinValidationRules = () => {
  return [body(Field.PRICE).notEmpty().isInt({ min: 0 })];
};

export const updateValidationRules = () => {
  return [
    body(Field.ACTION).notEmpty(),
    body(Field.AMOUNT).isInt({ min: 0 }).notEmpty(),
  ];
};

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: any[] = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
