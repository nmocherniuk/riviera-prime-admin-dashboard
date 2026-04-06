import { Router } from "express";
import {
  receiveWebhookController,
  verifyWebhookController,
} from "../modules/whatsapp/whatsapp.controller.js";

const router = Router();

router.get("/", verifyWebhookController);
router.post("/", receiveWebhookController);

export default router;
