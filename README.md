# Scalable Wallet Transaction System

A Node.js-based wallet transaction system handling concurrent financial operations using PostgreSQL, Redis, and queue-based asynchronous processing.

## Features

- User authentication with JWT
- Wallet management (create, deposit, withdraw, transfer)
- Transaction history
- Asynchronous processing with BullMQ
- Real-time notifications with Socket.io
- PostgreSQL database with Sequelize ORM
- Redis for caching and queues
- Docker support

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Cache/Queue**: Redis, BullMQ
- **ORM**: Sequelize
- **Authentication**: JWT
- **Logging**: Winston
- **Email**: Nodemailer
- **Real-time**: Socket.io

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd money-transfer-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     DATABASE_URL=postgresql://username:password@localhost:5432/money_transfer_db
     REDIS_URL=redis://localhost:6379
     JWT_SECRET=your_jwt_secret_here
     ```

4. **Database Setup**
   - Create a PostgreSQL database named `money_transfer_db`
   - The app will automatically sync the database schema on startup

5. **Redis Setup**
   - Ensure Redis is running on port 6379

6. **Run the application**
   ```bash
   npm start
   ```

## Docker Setup

```bash
docker compose up --build
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Wallet Operations
- `POST /api/wallet/create` - Create wallet
- `GET /api/wallet/:user_id` - Get wallet balance
- `POST /api/wallet/deposit` - Deposit money
- `POST /api/wallet/withdraw` - Withdraw money
- `POST /api/wallet/transfer` - Transfer money
- `GET /api/wallet/:user_id/transactions` - Get transaction history

## Project Structure

```
src/
├── config/
│   ├── db.js          # Database configuration
│   ├── redis.js       # Redis configuration
│   └── db/
│       ├── migrations/ # Database migrations
│       └── seeders/   # Database seeders
├── controllers/
│   └── wallet.js      # Wallet controllers
├── middlewares/
│   └── auth.js        # Authentication middleware
├── models/
│   ├── User.js        # User model
│   ├── Wallet.js      # Wallet model
│   ├── Transaction.js # Transaction model
│   └── index.js       # Model exports and sync
├── routes/
│   └── wallet.js      # Wallet routes
├── services/
│   ├── logger.js      # Logging service
│   ├── mailer.js      # Email service
│   ├── queue.js       # Queue service
│   └── socket.js      # Socket service
└── index.js           # Application entry point
```

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Testing

Add tests in a `tests/` directory and run with your preferred test runner.

## Deployment

This application is containerized with Docker and can be deployed to cloud platforms like AWS, GCP, or Heroku.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License