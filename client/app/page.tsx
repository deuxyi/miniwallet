'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
}

export default function Home() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState('');

  const API = '/api';

  useEffect(() => {
    fetch('/api/ping')
      .then((res) => res.text())
      .then((data) => console.log('Response from backend:', data))
      .catch((err) => console.error('Request failed:', err));
  }, []);

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${API}/create/`, { address });
      setMessage('Account created successfully!');
      setBalance(res.data.balance);
    } catch {
      setMessage('Account already exists or error occurred.');
    }
  };

  const handleFetchBalance = async () => {
    try {
      const res = await axios.get(`${API}/balance/${address}`);
      setBalance(res.data.balance);
      setMessage('');
    } catch {
      setMessage('Failed to fetch balance. Address may not exist.');
    }
  };

  const handleTransfer = async () => {
    try {
      await axios.post(`${API}/transfer`, { from: address, to, amount });
      setMessage('Transfer successful!');
      setTo('');
      setAmount(0);
      handleFetchBalance();
      fetchTransactions();
    } catch {
      setMessage('Transfer failed!');
    }
  };

  const fetchTransactions = async () => {
    const res = await axios.get(`${API}/transactions/${address}`);
    setTransactions(res.data);
  };

  const generateRandomAddress = () => {
    const hex = Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setAddress(`0x${hex}`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Virtual Ethereum Wallet</h1>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Wallet address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleCreate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create Account
            </button>
            <button
              onClick={handleFetchBalance}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Check Balance
            </button>
            <button
              onClick={fetchTransactions}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              View Records
            </button>
            <button
              onClick={generateRandomAddress}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Generate Random Address
            </button>
          </div>

          {balance !== null && <div className="text-lg">Balance: {balance} ETH</div>}
          {message && <div className="text-red-600 font-medium">{message}</div>}
        </div>

        <hr className="my-6" />

        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Make a Transfer</h2>
          <input
            type="text"
            placeholder="Recipient address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleTransfer}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Confirm Transfer
          </button>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-2">Transaction Records</h2>
        <div className="space-y-2">
          {transactions.length === 0 && <div>No transaction records.</div>}
          {transactions.map((tx, idx) => (
            <div key={idx} className="bg-gray-50 border rounded p-3 text-sm text-gray-800">
              <div><strong>From:</strong> {tx.from}</div>
              <div><strong>To:</strong> {tx.to}</div>
              <div><strong>Amount:</strong> {tx.amount} ETH</div>
              <div><strong>Time:</strong> {new Date(tx.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
