import { Router } from "express";
import { validateBody } from "../../middleware/validateBody.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  loginController,
  logoutController,
  meController,
  refreshController,
} from "./auth.controller.js";
import { loginSchema } from "./auth.schemas.js";
import type { AuthedRequest } from "../../middleware/requireAuth.js";

const router = Router();

router.post("/login", validateBody(loginSchema), loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", requireAuth, (req: AuthedRequest, res) => meController(req, res));

export default router;
