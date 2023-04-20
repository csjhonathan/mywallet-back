import express from 'express';
import cors from 'cors';
import PORT from './constants/port.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import signUpScheme from './schemas/sign-up-schema.js';
import signInScheme from './schemas/sign-in-schema.js';
import transactionScheme from './schemas/transaction-schema.js';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
dotenv.config();
const app = express();

app
    .use( cors() )
    .use( express.json() );

const mongoClient = new MongoClient( process.env.DATABASE_URL );

try{
    await mongoClient.connect();
    console.log( chalk.blue( 'DB CONNECTION SUCCESSFULLY' ) );
}catch( err ){
    console.log( err.message, chalk.red( 'DB CONNECTION FAILED' ) );
}

const db = mongoClient.db();



app.post( '/sign-up' , async ( req, res ) =>{

    const { nome , email , senha } = req.body;
    const {error} = signUpScheme.validate( {nome, email , senha}, {abortEarly : false} );

    if( error ){
        return res.status( 422 ).send( error.details.map( er => er.message ) );
    }

    try{
        const user = await db.collection( 'users' ).findOne( {email} );
        if( user ){
            return res.status( 409 ).send( {message : 'Usuário já cadastrado!'} );
        }
        const hash = bcrypt.hashSync( senha, 10 );
        await db.collection( 'users' ).insertOne( { nome , email , senha : hash } );
        res.status( 201 ).send( {message : 'Usuário cadastrado com sucesso!'} );
    }catch( err ){
        console.log( 500, err.message );
        res.status( 500 ).send( err.message );
    }
} );

app.post( '/sign-in', async ( req, res ) =>{
    const {email, senha} = req.body;
    const {error} = signInScheme.validate( {email, senha}, {abortEarly : false} );

    if( error ){
        return res.status( 422 ).send( {message : error.details.map( er => er.message )} );
    }

    try{
        const user = await db.collection( 'users' ).findOne( {email} );
        if( !user ) {
            return res.status( 404 ).send( {message : 'Usuário não cadastrado!'} );
        }
        const passwordIsCorrect = bcrypt.compareSync( senha, user.senha );

        if( !passwordIsCorrect ){
            return res.status( 401 ).send( {message : 'Senha incorreta!'} );
        }

        const token = uuid();

        await db.collection( 'sessions' ).insertOne( {
            userID : new ObjectId ( user._id ),
            token
        } );

        delete user.senha;

        res.status( 200 ).send( {...user, token} );
    }catch( err ){
        res.status( 500 ).send( err.message );
    }
} );

app.get( '/transactions', async( req, res ) => {
    const {authorization} = req.headers;
    const token = authorization?.split( ' ' )[1];
    
    if( !token ){
        return res.status( 401 ).send( {message : 'Token inválido ou não existe!'} );
    }

    try{
        const userSession = await db.collection( 'sessions' ).findOne( {token} );
        const userTransactions  = await db.collection( 'transactions' ).findOne( {userID : userSession.userID} );

        res.status( 200 ).send( {total : userTransactions?.total, transactions : userTransactions?.transactions.reverse()} );
    }catch( err ){
        res.status( 500 ).send( {message : err.message} );
    }
} );

app.post( '/transactions', async( req, res ) =>{

    const {authorization} = req.headers;
    const token = authorization?.split( ' ' )[1];
    const {value, type, description} = req.body;
    const {error} = transactionScheme.validate( {value, type, description} );

    if( !token ){
        return res.status( 401 ).send( {message : 'Token inválido ou não existe!'} );
    }

    if( error ){
        return res.status( 422 ).send( error.details.map( er => er.message ) );
    }

    try{
        const userSession = await db.collection( 'sessions' ).findOne( {token} );
        const userTransactions  = await db.collection( 'transactions' ).findOne( {userID : userSession.userID} );
    
        const transaction = {
            transactionID : nanoid(),
            value : value , 
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
            return acc+= trans.type === 'spent' ? - Number( trans.value ) : Number( trans.value );
        }, 0 );

        await db.collection( 'transactions' ).updateOne( {userID : userSession.userID} , {$set : {transactions : userTransactions.transactions, total }} );

        await db.collection( 'transactions' ).findOne( {userID : userSession.userID} );

        res.sendStatus( 200 );
    }catch( err ){
        res.status( 500 ).send( {message : err.message} );
    }   
} );
app.listen( PORT, () => {
    console.log( `Server is running on ${chalk.green( `http://localhost:${PORT}` )}` );
} );