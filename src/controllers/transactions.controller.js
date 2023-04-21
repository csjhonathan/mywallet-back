import { db } from '../database/database.connection.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export async function getTransactions( req, res ) {
    const { userTransactions } = res.locals;

    try{
        res.status( 200 ).send( {total : userTransactions?.total, transactions : userTransactions?.transactions.reverse()} );
    }catch( err ){
        res.status( 500 ).send( {message : err.message} );
    }
}

export async function postTransactions( req, res ){
    
    const { value, type, description } = req.body;
    const { userSession, userTransactions } = res.locals;

    try{
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

    const { ID } = req.params;
    const { userSession, userTransactions } = res.locals;

    try{
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
    const { ID } = req.params;
    const { userSession, userTransactions } = res.locals;

    try{
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