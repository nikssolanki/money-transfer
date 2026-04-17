import { DataTypes } from 'sequelize';
import sequelize from '../config/db/db.js';
import User from './User.js';

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  balance: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0.00,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
}, {
  tableName: 'wallets',
});

Wallet.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Wallet, { foreignKey: 'user_id' });

export default Wallet;