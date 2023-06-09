import { celebrate, Joi, Segments } from 'celebrate'

export default class Validator {
  static signupValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required().trim().lowercase(),
      password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)
        .required()
        .label('Password')
        .messages({
          'string.min': '{#label} Must have at least 8 characters',
          'string.pattern.base':
            '{#label} must include at least eight characters, one uppercase and lowercase letter and one number',
        }),
    }),
  })
}
