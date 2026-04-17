import sequelize from '../config/db/db.js';
import User from './User.js';
import Wallet from './Wallet.js';
import Transaction from './Transaction.js';

const models = {
  User,
  Wallet,
  Transaction,
};

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

export default models;