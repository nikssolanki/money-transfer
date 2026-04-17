import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import logger from '../../services/logger.js';

dotenv.config();

const dialect = process.env.DB_DIALECT || 'sqlite';
const storage = process.env.SQLITE_FILENAME || './src/config/db/dev.sqlite3';
const databaseUrl = process.env.DATABASE_URL;

// const sequelize = databaseUrl
//   ? new Sequelize(databaseUrl, {
//       dialect: process.env.DB_DIALECT || 'postgres',
//       username: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT,
//       database: process.env.DB_NAME,
//       logging: false,
//       dialectOptions: process.env.DB_SSL === 'true'
//         ? { ssl: { require: true, rejectUnauthorized: false } }
//         : {},
//     })
//   : new Sequelize({
//       dialect,
//       storage,
//       logging: false,
//       define: {
//         underscored: true,
//         timestamps: true,
//       },
//     });
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
