import { Router } from "express";
import { requireAuth } from "../../../../middleware/requireAuth.js";
import {
  getAdminBalanceController,
  listPaymentsController,
  withdrawAdminBalanceController,
} from "../../controllers/admin/payments.controller.js";

const router = Router();

router.get("/", requireAuth, listPaymentsController);
router.get("/admin/balance", requireAuth, getAdminBalanceController);
router.post("/admin/withdraw", requireAuth, withdrawAdminBalanceController);

export default router;
