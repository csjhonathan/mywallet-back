import Joi from 'joi';

const signInScheme = Joi.object( {
    email : Joi
        .string()
        .required()
        .email(),
    senha : Joi
        .string()
        .required()
        .min( 3 ),
} );

export default signInScheme;