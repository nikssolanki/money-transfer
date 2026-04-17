// import { Queue, Worker } from 'bullmq';
// import redisClient from '../config/redis.js';
// import logger from './logger.js';

// // Create a queue for transactions
// const transactionQueue = new Queue('transactions', {
//   connection: redisClient,
// });

// // Worker to process transactions
// const transactionWorker = new Worker('transactions', async (job) => {
//   const { type, data } = job.data;
//   logger.info(`Processing ${type} transaction:`, data);

//   // Here you would implement the actual transaction logic
//   // For example, update wallet balances, send notifications, etc.

//   switch (type) {
//     case 'deposit':
//       // Handle deposit
//       break;
//     case 'withdraw':
//       // Handle withdraw
//       break;
//     case 'transfer':
//       // Handle transfer
//       break;
//     default:
//       throw new Error(`Unknown transaction type: ${type}`);
//   }

//   return { success: true };
// }, {
//   connection: redisClient,
// });

// transactionWorker.on('completed', (job) => {
//   logger.info(`Job ${job.id} completed`);
// });

// transactionWorker.on('failed', (job, err) => {
//   logger.error(`Job ${job.id} failed:`, err);
// });

// export { transactionQueue, transactionWorker };
// export default transactionQueue;