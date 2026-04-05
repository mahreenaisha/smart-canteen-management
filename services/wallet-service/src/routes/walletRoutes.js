import express from "express";
import WalletController from "../controllers/walletController.js";

const router = express.Router();

router.post("/create", WalletController.createWallet);
router.get("/:studentId", WalletController.getWalletByStudentId);
router.post("/debit", WalletController.debitWallet);

export default router;