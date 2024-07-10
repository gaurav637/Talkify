import express from "express";
import { Router } from "express";
import {registerUser} from "../controller/userRegister.js";
import {verifyEmail} from "../controller/checkEmail.js";
import {checkPassword} from "../controller/checkPassword.js";
import { loginUser } from "../controller/userRegister.js";

const router = Router();

router
    .route('/login') 
    .post(loginUser);
router
    .route('/register') 
    .post(registerUser);    
router
    .route('/check-email')
    .post(verifyEmail);
router
    .route('/check-password') 
    .post(checkPassword);

export default router;    