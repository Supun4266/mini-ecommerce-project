import express from 'express'
import { validateLoginInput, validateRegisterInput } from '../middleware/validateUser.js';
import { loginUser, registerUser } from '../controllers/user/userController.js';

const userRouter = express.Router();

userRouter.post("/register",validateRegisterInput,registerUser);
userRouter.post("/login",validateLoginInput,loginUser);

export default userRouter;