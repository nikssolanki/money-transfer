import { DataTypes } from 'sequelize';
import sequelize from '../config/db/db.js';
import User from './User.js';
import Wallet from './Wallet.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  from_wallet_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Wallet,
      key: 'id',
    },
  },
  to_wallet_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Wallet,
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdraw', 'transfer'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'transactions',
});

Transaction.belongsTo(Wallet, { foreignKey: 'from_wallet_id', as: 'fromWallet' });
Transaction.belongsTo(Wallet, { foreignKey: 'to_wallet_id', as: 'toWallet' });
Wallet.hasMany(Transaction, { foreignKey: 'from_wallet_id' });
Wallet.hasMany(Transaction, { foreignKey: 'to_wallet_id' });

export default Transaction;