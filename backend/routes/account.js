const express = require("express");
const { Bank } = require("../db");
const authMiddleware = require("../middleware/middleware");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  try {
    const acc = await Bank.findOne({ userId: userId });
    console.log(acc);

    if (acc) {
      res.status(200).json({ balance: acc.balance });
    } else {
      res.status(404).json({ message: "Account not found" });
    }
  } catch (error) {
    console.error(error); // Changed log.error to console.error for consistency
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;

  const account = await Bank.findOne({ userId: req.userId }).session(session);
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  await Bank.updateOne(
    { userID: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Bank.updateOne({ userId: to }, { $inc: { balance: amount } }).session(
    session
  );

  await session.commitTransaction();
  res.json({ message: "Transfer successful" });
});

module.exports = router;
