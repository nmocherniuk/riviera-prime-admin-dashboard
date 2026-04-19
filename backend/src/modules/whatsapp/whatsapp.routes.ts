import { Router } from "express";
import {
  receiveWebhookController,
  verifyWebhookController,
} from "./whatsapp.controller.js";

const router = Router();

router.get("/", verifyWebhookController);
router.post("/", receiveWebhookController);

export default router;
