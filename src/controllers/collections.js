import { db } from '../database/database.connection.js';

export const users = db.collection( 'users' );
export const transactions = db.collection( 'transactions' );
export const sessions = db.collection( 'sessions' );