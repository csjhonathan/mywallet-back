import { app } from './app.js';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

app.listen( process.env.PORT , () => {
    console.log( `Server is running on ${chalk.green( `http://localhost:${process.env.PORT}` )}` );
} );