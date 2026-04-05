import Wallet from "../models/Wallet.js";

class WalletController {
  static async createWallet(req, res) {
    try {
      const { studentId, balance } = req.body;

      if (!studentId || balance === undefined) {
        return res.status(400).json({
          message: "studentId and balance are required"
        });
      }

      const existingWallet = await Wallet.findOne({ studentId });

      if (existingWallet) {
        return res.status(400).json({
          message: "Wallet already exists for this student"
        });
      }

      const wallet = await Wallet.create({
        studentId,
        balance
      });

      return res.status(201).json({
        message: "Wallet created successfully",
        wallet
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }

  static async getWalletByStudentId(req, res) {
    try {
      const { studentId } = req.params;

      const wallet = await Wallet.findOne({ studentId });

      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found"
        });
      }

      return res.status(200).json(wallet);
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }

  static async debitWallet(req, res) {
    try {
      const { studentId, amount } = req.body;

      if (!studentId || amount === undefined) {
        return res.status(400).json({
          message: "studentId and amount are required"
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          message: "Amount must be greater than 0"
        });
      }

      const updatedWallet = await Wallet.findOneAndUpdate(
        {
          studentId,
          balance: { $gte: amount }
        },
        {
          $inc: { balance: -amount }
        },
        {
          new: true
        }
      );

      if (!updatedWallet) {
        return res.status(400).json({
          message: "Insufficient balance or wallet not found"
        });
      }

      return res.status(200).json({
        message: "Wallet debited successfully",
        remainingBalance: updatedWallet.balance,
        wallet: updatedWallet
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
}

export default WalletController;