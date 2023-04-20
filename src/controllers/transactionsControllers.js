import transactionScheme from '../schemas/transaction-schema.js';
import { db } from '../app.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';


export async function getTransactions( req, res ) {
    const {authorization} = req.headers;
    const token = authorization?.split( ' ' )[1];
  
    if( !token ){
        return res.status( 401 ).send( {message : 'Não autorizado!'} );
    }

    try{
        const userSession = await db.collection( 'sessions' ).findOne( {token} );
        const userTransactions  = await db.collection( 'transactions' ).findOne( {userID : userSession.userID} );

        res.status( 200 ).send( {total : userTransactions?.total, transactions : userTransactions?.transactions.reverse()} );
    }catch( err ){
        res.status( 500 ).send( {message : err.message} );
    }
}

export async function postTransactions( req, res ){

    const {authorization} = req.headers;
    const token = authorization?.split( ' ' )[1];
    const {value, type, description} = req.body;
    const {error} = transactionScheme.validate( {value, type, description} );

    if( !token ){
        return res.status( 401 ).send( {message : 'Não autorizado!'} );
    }

    if( error ){
        return res.status( 422 ).send( {message : error.details.map( er => er.message )} );
    }

    try{
        const userSession = await db.collection( 'sessions' ).findOne( {token} );
        const userTransactions  = await db.collection( 'transactions' ).findOne( {userID : userSession.userID} );
        const transaction = {
            transactionID : nanoid(),
            value : type === 'deposit' ? value : -value , 
            type, 
            description,
            date : dayjs().format( 'DD/MM' )
        };

        if( !userTransactions ){
            await db.collection( 'transactions' ).insertOne( {userID : userSession.userID, transactions : [transaction], total : transaction.value} ); 
            return res.sendStatus( 200 ); 

        }

        userTransactions.transactions.push( transaction );

        const total = userTransactions.transactions.reduce( ( acc, trans ) => {
            return acc+= trans.value ;
        }, 0 );

        await db.collection( 'transactions' ).updateOne( {userID : userSession.userID} , {$set : {transactions : userTransactions.transactions, total }} );


        res.sendStatus( 200 );
    }catch( err ){
        res.status( 500 ).send( {message : err.message} );
    }   
}

export async function deleteTransactionByID( req, res ) {
    const {authorization} = req.headers;
    const token = authorization?.split( ' ' )[1];
    const { ID } = req.params;

    if( !token ){
        return res.status( 401 ).send( {message : 'Não autorizado!'} );
    }
    try{
        const userSession = await db.collection( 'sessions' ).findOne( {token} );

        const userTransactions  = await db.collection( 'transactions' ).findOne( {userID : userSession.userID} );
        const transaction = userTransactions.transactions.find( ( {transactionID} ) => transactionID===ID );

        await db.collection( 'transactions' ).updateOne(
            {userID : userSession.userID},
            { $pull: { transactions: { transactionID: ID } },
                $inc: { total: -parseFloat( transaction.value ) } }
        );
        res.status( 202 ).send( 'Transação deletada!' );
    }catch( err ){
        res.status( 500 ).send( {message : err.message} );
    }
}

export async function editTransactionByID( req, res ){
    const {authorization} = req.headers;
    const token = authorization?.split( ' ' )[1];
    const { ID } = req.params;
    const {value, description, type} = req.body;

    const {error} = transactionScheme.validate( {value, description, type} );

    if( !token ){
        return res.status( 401 ).send( {message : 'Não autorizado!'} );
    }

    if( error ){
        return res.status( 422 ).send( {message : error.details.map( er => er.message )} );
    }

    try{
        const userSession = await db.collection( 'sessions' ).findOne( {token} );
        const userTransactions  = await db.collection( 'transactions' ).findOne( {userID : userSession.userID} );
        const editedTransactions = userTransactions.transactions.map( ( trans ) => {
            if( trans.transactionID === ID ){
                return{
                    ...trans,
                    value : trans.type === 'deposit' ? req.body.value : -req.body.value,
                    description : req.body.description
                };
            }

            return trans;
        } );
        const total = editedTransactions.reduce( ( acc, trans ) => {
            return acc+= trans.value ;
        }, 0 );

        await db.collection( 'transactions' ).updateOne( {userID : userSession.userID} , {$set : {transactions : editedTransactions, total }} );
        res.sendStatus( 200 );

    }catch( err ){
        res.status( 500 ).send( {message : err.message} );
    }
    
}