import { Router } from 'express';
import { signIn, signUp } from '../controllers/auths.controller.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';
import signInScheme from '../schemas/sign-in.schema.js';
import signUpScheme from '../schemas/sign-up.schema.js';

const authsRouter = Router();

authsRouter.post( '/sign-up' , validateSchema( signUpScheme ), signUp  );

authsRouter.post( '/sign-in', validateSchema( signInScheme ), signIn );

export default authsRouter;