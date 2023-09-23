import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './routes/index.routes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './swagger.js';

dotenv.config();

export const app = express();

app
    .use( cors() )
    .use( express.json() )
    .use( '/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerDocs ) )
    .use( route );