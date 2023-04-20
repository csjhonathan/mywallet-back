import app from './app.js';
import chalk from 'chalk';

app.listen( process.env.PORT , () => {
    console.log( `Server is running on ${chalk.green( `http://localhost:${process.env.PORT}` )}` );
} );