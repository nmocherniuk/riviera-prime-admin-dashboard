import { Router } from "express";
import { stripeWebhookController } from "../modules/stripe/stripe.webhook.controller.js";

const router = Router();

router.post("/", stripeWebhookController);

export default router;
