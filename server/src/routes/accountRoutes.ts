import {  Router } from 'express';
import { createAccount, getAccount, transfer, getTransactions } from '../controllers/accountController';

const router = Router();

router.post('/create/', createAccount);
//router.get('/balance/:address', getAccount);
//router.post('/transfer', transfer);
router.get('/transactions/:address', getTransactions);
router.get('/ping', (req, res) => {
    res.send('pong');
  });

export default router;