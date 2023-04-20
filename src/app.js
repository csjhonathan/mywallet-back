import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { signIn, signUp } from './controllers/authControllers.js';
import { getTransactions, postTransactions, deleteTransactionByID } from './controllers/transactionsControllers.js';

dotenv.config();
export const app = express();

app
    .use( cors() )
    .use( express.json() );

const mongoClient = new MongoClient( process.env.MONGO_URI );

try{
    await mongoClient.connect();
    console.log( chalk.blue( 'DB CONNECTION SUCCESSFULLY' ) );
}catch( err ){
    console.log( err.message, chalk.red( 'DB CONNECTION FAILED' ) );
}

export const db = mongoClient.db();



app.post( '/sign-up' , signUp  );

app.post( '/sign-in', signIn );

app.get( '/transactions', getTransactions );

app.post( '/transactions', postTransactions );

app.delete( '/transactions/:ID', deleteTransactionByID );