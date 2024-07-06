import express from "express";
import { Router } from "express";
const router = Router();
import {registerUser} from "../controller/userRegister.js";
import {verifyEmail} from "../controller/checkEmail.js";

router.route('/register') .post(registerUser);
router.route('check-email' , verifyEmail);

export default router;    