import { Router } from "express";
import * as ApiController from "../controllers/api.controller.js";
import { privateRoute } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.get("/ping", ApiController.ping);
router.post("/login", privateRoute, ApiController.login);
router.post("/register", ApiController.register);
router.get("/list", privateRoute, ApiController.list);

export default router;