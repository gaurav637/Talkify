import express from "express";
import { Router } from "express";
import {registerUser} from "../controller/userRegister.js";
import {verifyEmail} from "../controller/checkEmail.js";
import {checkPassword} from "../controller/checkPassword.js";
const router = Router();

router
    .route('/register') 
    .post(registerUser);
router
    .route('/check-email')
    .get(verifyEmail);
router
    .route('./check-password') 
    .get(checkPassword);

export default router;    