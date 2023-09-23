import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { users, sessions } from './collections.js';

export async function signUp( req, res ){

    const { nome , email , senha } = req.body;
    try{
        const user = await users.findOne( {email} );
        if( user ){
            return res.status( 409 ).send( {message : 'Usuário já cadastrado!'} );
        }
        const hash = bcrypt.hashSync( senha, 10 );
        await users.insertOne( { nome , email , senha : hash } );
        res.status( 201 ).send( {message : 'Usuário cadastrado com sucesso!'} );
    }catch( err ){
        res.status( 500 ).send( err.message );
    }
}

export async function signIn( req, res ) {
    
    const {email, senha} = req.body;
    
    try{

        const user = await users.findOne( {email} );

        if( !user ) {
            return res.status( 404 ).send( {message : 'Usuário não cadastrado!'} );
        }
        const passwordIsCorrect = bcrypt.compareSync( senha, user.senha );

        if( !passwordIsCorrect ){
            return res.status( 401 ).send( {message : 'Senha incorreta!'} );
        }

        const token = uuid();

        await sessions.insertOne( {
            userID : new ObjectId ( user._id ),
            token
        } );

        delete user.senha;
        res.status( 200 ).send( {...user, token} );
    }catch( err ){
        res.status( 500 ).send( err.message );
    }
}
