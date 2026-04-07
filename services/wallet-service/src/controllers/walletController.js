import Wallet from "../models/Wallet.js";

class WalletController {
  static async createWallet(req, res) {
    try {
      const { studentId, balance } = req.body;
      const isAdmin = req.user?.role === "admin";

      if (!studentId || balance === undefined) {
        return res.status(400).json({
          message: "studentId and balance are required"
        });
      }

      if (!isAdmin && req.user?.studentId !== studentId) {
        return res.status(403).json({
          message: "You can only create or update your own wallet"
        });
      }

      const wallet = await Wallet.findOneAndUpdate(
      { studentId }, 
      { $inc: { balance: balance } }, // $inc adds the value to the current balance
      { 
        returnDocument: 'after',      // returns the updated document
        upsert: true,   // creates the document if it doesn't exist
        setDefaultsOnInsert: true // ensures schema defaults are applied if created
      }
    );

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
      const isAdmin = req.user?.role === "admin";

      if (!isAdmin && req.user?.studentId !== studentId) {
        return res.status(403).json({
          message: "You can only view your own wallet"
        });
      }

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
      const isAdmin = req.user?.role === "admin";

      if (!studentId || amount === undefined) {
        return res.status(400).json({
          message: "studentId and amount are required"
        });
      }

      if (!isAdmin && req.user?.studentId !== studentId) {
        return res.status(403).json({
          message: "You can only debit your own wallet"
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
