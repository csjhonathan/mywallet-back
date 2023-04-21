import Joi from 'joi';

const transactionScheme = Joi.object( {
    value : Joi
        .number()
        .required()
        .greater( 0 ),
    type : Joi
        .string()
        .required()
        .valid( 'spent', 'deposit' ),
    description: Joi
        .string()
        .required()
} );

export default transactionScheme;