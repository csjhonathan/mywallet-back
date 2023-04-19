import express from 'express';
import cors from 'cors';
import PORT from './constants/port.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import signUpScheme from './schemas/sign-up-schema.js';
import bcrypt from 'bcrypt';
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
            return res.status( 409 ).send( {message : 'Usuário já cadastrado.'} );
        }
        const hash = bcrypt.hashSync( senha, 10 );
        await db.collection( 'users' ).insertOne( { nome , email , senha : hash } );
        res.status( 201 ).send( {message : 'Usuário cadastrado com sucesso!'} );
    }catch( err ){
        console.log( 500, err.message );
        res.status( 500 ).send( err.message );
    }
} );


app.listen( PORT, () => {
    console.log( `Server is running on ${chalk.green( `http://localhost:${PORT}` )}` );
} );