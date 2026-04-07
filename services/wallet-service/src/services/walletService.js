import axios from "axios";

const debitWallet = async (studentId, amount) => {
  try {
    const response = await axios.post(
      `${process.env.WALLET_SERVICE}/api/wallet/debit`,
      {
        studentId,
        amount
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error debiting wallet:", error.message);

    throw new Error(
      error.response?.data?.message || "Wallet debit failed"
    );
  }
};

export { debitWallet };
