import stripe from '../config/stripe.js';
import logger from './logger.js';

export const createBankAccountPaymentMethod = async (accountNumber, routingNumber, accountHolderName, accountHolderType) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'us_bank_account',
      us_bank_account: {
        account_number: accountNumber,
        routing_number: routingNumber,
        account_holder_type: accountHolderType, // 'individual' or 'company'
      },
      billing_details: {
        name: accountHolderName,
      },
    });
    return paymentMethod;
  } catch (error) {
    logger.error('Error creating bank account payment method:', error);
    throw error;
  }
};

export const createPaymentIntent = async (amount, currency, paymentMethodId, userId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency,
      payment_method: paymentMethodId,
      payment_method_types: ['us_bank_account'],
      confirm: true,
      mandate_data: {
        customer_acceptance: {
          type: 'online',
          online: {
            ip_address: '127.0.0.1', // In production, get from request
            user_agent: 'Node.js', // In production, get from request
          },
        },
      },
      metadata: {
        user_id: userId,
      },
    });
    return paymentIntent;
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    throw error;
  }
};

export const createBankAccountToken = async (accountNumber, routingNumber, accountHolderName, accountHolderType) => {
  try {
    const token = await stripe.tokens.create({
      bank_account: {
        country: 'US',
        currency: 'usd',
        account_holder_type: accountHolderType,
        routing_number: routingNumber,
        account_number: accountNumber,
      },
    });
    return token;
  } catch (error) {
    logger.error('Error creating bank account token:', error);
    throw error;
  }
};

export const createPayout = async (amount, currency, destination, userId) => {
  try {
    const payout = await stripe.payouts.create({
      amount: amount * 100,
      currency,
      destination, // Bank account ID or card ID
      metadata: {
        user_id: userId,
      },
    });
    return payout;
  } catch (error) {
    logger.error('Error creating payout:', error);
    throw error;
  }
};