import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const mongoClient = new MongoClient( process.env.MONGO_URI );

try{
    await mongoClient.connect();
    console.log( chalk.blue( 'DB CONNECTION SUCCESSFULLY' ) );
}catch( err ){
    console.log( err );
    console.log( err.message, chalk.red( 'DB CONNECTION FAILED' ) );
}

export const db = mongoClient.db();
