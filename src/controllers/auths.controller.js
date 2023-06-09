import { db } from '../database/database.connection.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';


export async function signUp( req, res ){

    const { nome , email , senha } = req.body;
    try{
        const user = await db.collection( 'users' ).findOne( {email} );
        if( user ){
            return res.status( 409 ).send( {message : 'Usuário já cadastrado!'} );
        }
        const hash = bcrypt.hashSync( senha, 10 );
        await db.collection( 'users' ).insertOne( { nome , email , senha : hash } );
        res.status( 201 ).send( {message : 'Usuário cadastrado com sucesso!'} );
    }catch( err ){
        res.status( 500 ).send( err.message );
    }
}

export async function signIn( req, res ) {
    
    const {email, senha} = req.body;
    
    try{

        const user = await db.collection( 'users' ).findOne( {email} );

        if( !user ) {
            return res.status( 404 ).send( {message : 'Usuário não cadastrado!'} );
        }
        const passwordIsCorrect = bcrypt.compareSync( senha, user.senha );

        if( !passwordIsCorrect ){
            return res.status( 401 ).send( {message : 'Senha incorreta!'} );
        }

        const token = uuid();

        await db.collection( 'sessions' ).insertOne( {
            userID : new ObjectId ( user._id ),
            token
        } );

        delete user.senha;
        res.status( 200 ).send( {...user, token} );
    }catch( err ){
        res.status( 500 ).send( err.message );
    }
}
