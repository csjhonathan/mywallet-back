import { Router } from 'express';
import authsRouter from './auths.routes.js';
import transactionsRouter from './transactions.routes.js';

const route = Router();

route.use( transactionsRouter );
route.use( authsRouter );

export default route;