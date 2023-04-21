import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './routes/index.routes.js';

dotenv.config();

export const app = express();

app
    .use( cors() )
    .use( express.json() )
    .use( route );