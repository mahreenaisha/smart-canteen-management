const axios = require("axios");

const debitWallet = async (studentId, amount, token) => {
  try {
    const response = await axios.post(
      `${process.env.WALLET_SERVICE}/api/wallet/debit`,
      {
        studentId,
        amount
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("Wallet Service Error:", error.message);

    // Handle insufficient balance or service failure
    if (error.response) {
      throw new Error(error.response.data.message || "Wallet debit failed");
    }

    throw new Error("Wallet Service unavailable");
  }
};

module.exports = { debitWallet };
