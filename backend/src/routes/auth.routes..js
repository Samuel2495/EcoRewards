import express from "express";
import { signup, login } from "../controllers/auth-controller";

const router = express.router();

router.post("/signup", signup);
router.post("/login", login);

export default router;