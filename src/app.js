import express from 'express';
import cors from 'cors';
import PORT from './constants/port.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import signUpScheme from './schemas/sign-up-schema.js';
import signInScheme from './schemas/sign-in-schema.js';
import bcrypt from 'bcrypt';
import { v4 as uuid, validate } from 'uuid';
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

        res.status( 200 ).send( {token, nome : user.nome} );
    }catch( err ){
        res.status( 500 ).send( err.message );
    }
} );

app.listen( PORT, () => {
    console.log( `Server is running on ${chalk.green( `http://localhost:${PORT}` )}` );
} );