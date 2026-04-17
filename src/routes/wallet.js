import express from 'express';
import {
  createWallet,
  getWallet,
  deposit,
  withdraw,
  transfer,
  getTransactions,
} from '../controllers/wallet.js';
import authenticateToken from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/create', createWallet);
router.get('/:user_id', getWallet);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
router.get('/:user_id/transactions', getTransactions);

export default router;