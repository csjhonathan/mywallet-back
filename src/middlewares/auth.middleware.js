import { db } from '../database/database.connection.js';

export default async function authValidation ( req, res, next ){
    const {authorization} = req.headers;
    const token = authorization?.split( ' ' )[1];

    if( !token ){
        return res.status( 401 ).send( {message : 'Não autorizado!'} );
    }

    try{

        const userSession = await db.collection( 'sessions' ).findOne( {token} );

        if( !userSession ){
            return res.status( 401 ).send( { message : 'Não autorizado!' } );
        }

        const userTransactions  = await db.collection( 'transactions' ).findOne( {userID : userSession.userID} );
        res.locals.userSession = userSession;
        res.locals.userTransactions = userTransactions;
        next();

    }catch( err ){
        res.status( 500 ).send( { message : err.message } );
    }
}