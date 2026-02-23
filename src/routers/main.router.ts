import { Router } from "express";
import * as ApiController from "../controllers/api.controller.js";

const router: Router = Router();

router.get("/ping", ApiController.ping);

export default router;