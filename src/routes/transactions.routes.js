import { Router } from 'express';
import { deleteTransactionByID, editTransactionByID, getTransactions, postTransactions } from '../controllers/transactions.controller.js';
import transactionScheme from '../schemas/transaction.schema.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import authValidation from '../middlewares/auth.middleware.js';

const transactionsRouter = Router();

transactionsRouter.use( authValidation );

transactionsRouter.post( '/transactions', validateSchema( transactionScheme ) ,postTransactions );

transactionsRouter.put( '/transactions/:ID', validateSchema( transactionScheme ), editTransactionByID );

transactionsRouter.get( '/transactions', getTransactions );

transactionsRouter.delete( '/transactions/:ID', deleteTransactionByID );


export default transactionsRouter;