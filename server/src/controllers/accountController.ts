import { Request, Response } from 'express';
import Account from '../models/Account';
import Transaction from '../models/Transaction';

export const createAccount = async (req: Request, res: Response) => {
  const { address } = req.body;

  try {
    const newAccount = new Account({ address, balance: 100 });
    await newAccount.save();
    console.log('Account saved to DB:', newAccount);
    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Failed to create account:', error);
    res.status(400).json({ message: 'Failed to create account', error });
  }
};

export const getAccount = async (req: Request, res: Response) => {
  const { address } = req.params;
  try {
    const account = await Account.findOne({ address });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve account', error });
  }
};

export const transfer = async (req: Request, res: Response) => {
  const { from, to, amount } = req.body;
  try {
    const sender = await Account.findOne({ address: from });
    const receiver = await Account.findOne({ address: to });

    if (!sender || !receiver) return res.status(404).json({ message: 'Account not found' });
    if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = new Transaction({ from, to, amount });
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Transfer failed', error });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  const { address } = req.params;
  try {
    const transactions = await Transaction.find({
      $or: [{ from: address }, { to: address }]
    }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve transactions', error });
  }
};
