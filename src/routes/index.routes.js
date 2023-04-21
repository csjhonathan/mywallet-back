import { Router } from 'express';
import authsRouter from './auths.routes.js';
import transactionsRouter from './transactions.routes.js';

const route = Router();

route.use( authsRouter );
route.use( transactionsRouter );


export default route;