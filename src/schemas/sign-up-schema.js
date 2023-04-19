import Joi from 'joi';

const signUpScheme = Joi.object( {
    nome : Joi
        .string()
        .required(),
    email : Joi
        .string()
        .required()
        .email(),
    senha : Joi
        .string()
        .required()
        .min( 3 ),
} );

export default signUpScheme;