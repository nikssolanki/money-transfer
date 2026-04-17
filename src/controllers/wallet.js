import models from '../models/index.js';
// import { transactionQueue } from '../services/queue.js';
import logger from '../services/logger.js';
import { createBankAccountPaymentMethod, createBankAccountToken, createPayout } from '../services/payment.js';

const { Wallet, Transaction } = models;

// Create wallet for user
export const createWallet = async (req, res) => {
  try {
    const { user_id } = req.body;
    const wallet = await Wallet.create({ user_id });
    res.status(201).json(wallet);
  } catch (error) {
    logger.error('Error creating wallet:', error);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
};

// Get wallet balance
export const getWallet = async (req, res) => {
  try {
    const { user_id } = req.params;
    const wallet = await Wallet.findOne({ where: { user_id } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (error) {
    logger.error('Error getting wallet:', error);
    res.status(500).json({ error: 'Failed to get wallet' });
  }
};

// Deposit money via bank transfer
export const deposit = async (req, res) => {
  try {
    const { user_id, amount, accountNumber, routingNumber, accountHolderName, accountHolderType } = req.body;
    // Create bank account payment method
    const paymentMethod = await createBankAccountPaymentMethod(accountNumber, routingNumber, accountHolderName, accountHolderType);
    // Create and confirm payment intent
    const paymentIntent = await createPaymentIntent(amount, 'usd', paymentMethod.id, user_id);
    if (paymentIntent.status === 'succeeded') {
      // Update wallet balance
      const wallet = await Wallet.findOne({ where: { user_id } });
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
      await wallet.save();
      res.json({ message: 'Deposit successful', balance: wallet.balance, paymentIntentId: paymentIntent.id });
    } else {
      res.status(400).json({ error: 'Payment failed', status: paymentIntent.status });
    }
  } catch (error) {
    logger.error('Error depositing:', error);
    res.status(500).json({ error: 'Failed to deposit' });
  }
};

// Withdraw money via bank transfer
export const withdraw = async (req, res) => {
  try {
    const { user_id, amount, accountNumber, routingNumber, accountHolderName, accountHolderType } = req.body;
    const wallet = await Wallet.findOne({ where: { user_id } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    // Create bank account token
    const token = await createBankAccountToken(accountNumber, routingNumber, accountHolderName, accountHolderType);
    // Create payout (assuming bank account is attached to Stripe account)
    const payout = await createPayout(amount, 'usd', token.id, user_id);
    if (payout.status === 'pending' || payout.status === 'paid') {
      wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
      await wallet.save();
      res.json({ message: 'Withdrawal initiated', balance: wallet.balance, payoutId: payout.id });
    } else {
      res.status(400).json({ error: 'Payout failed', status: payout.status });
    }
  } catch (error) {
    logger.error('Error withdrawing:', error);
    res.status(500).json({ error: 'Failed to withdraw' });
  }
};

// Transfer money
export const transfer = async (req, res) => {
  try {
    const { from_user_id, to_user_id, amount } = req.body;
    // await transactionQueue.add('transfer', { from_user_id, to_user_id, amount });
    const fromWallet = await Wallet.findOne({ where: { user_id: from_user_id } });
    const toWallet = await Wallet.findOne({ where: { user_id: to_user_id } });
    if (!fromWallet || !toWallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    if (parseFloat(fromWallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    fromWallet.balance = parseFloat(fromWallet.balance) - parseFloat(amount);
    toWallet.balance = parseFloat(toWallet.balance) + parseFloat(amount);
    await fromWallet.save();
    await toWallet.save();
    res.json({ message: 'Transfer successful' });
  } catch (error) {
    logger.error('Error transferring:', error);
    res.status(500).json({ error: 'Failed to transfer' });
  }
};

// Get transaction history
export const getTransactions = async (req, res) => {
  try {
    const { user_id } = req.params;
    const wallet = await Wallet.findOne({ where: { user_id } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    const transactions = await Transaction.findAll({
      where: {
        [models.Sequelize.Op.or]: [
          { from_wallet_id: wallet.id },
          { to_wallet_id: wallet.id },
        ],
      },
      include: [
        { model: Wallet, as: 'fromWallet', include: [models.User] },
        { model: Wallet, as: 'toWallet', include: [models.User] },
      ],
    });
    res.json(transactions);
  } catch (error) {
    logger.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
};