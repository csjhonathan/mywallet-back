import express from 'express';
import cors from 'cors';
import PORT from './constants/port.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

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

app.listen( PORT, () => {
    console.log( `Server is running on ${chalk.green( `http://localhost:${PORT}` )}` );
} );