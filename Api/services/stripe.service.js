const Stripe = require('stripe');

let stripe = null;

// Initialiser Stripe seulement si la clé API est disponible
const initializeStripe = () => {
  if (stripe) {
    return stripe;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  STRIPE_SECRET_KEY manquante. Le service Stripe ne sera pas initialisé');
    return null;
  }

  try {
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Service Stripe initialisé avec succès');
    return stripe;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Stripe:', error.message);
    return null;
  }
};

exports.createPaymentIntent = async (amount, currency = 'eur', metadata = {}) => {
  try {
    const stripeInstance = initializeStripe();
    if (!stripeInstance) {
      throw new Error('Stripe n\'est pas configuré. Vérifiez STRIPE_SECRET_KEY dans vos variables d\'environnement.');
    }
    
    if (!amount || amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      }
    });

    console.log('✅ Payment Intent créé avec succès:', paymentIntent.id);
    return paymentIntent;
  } catch (error) {
    console.error('❌ Erreur lors de la création du Payment Intent:', error.message);
    throw error;
  }
};

exports.confirmPayment = async (paymentIntentId) => {
  try {
    const stripeInstance = initializeStripe();
    if (!stripeInstance) {
      throw new Error('Stripe n\'est pas configuré');
    }

    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('❌ Erreur lors de la confirmation du paiement:', error.message);
    throw error;
  }
};

exports.createRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
  try {
    const stripeInstance = initializeStripe();
    if (!stripeInstance) {
      throw new Error('Stripe n\'est pas configuré');
    }

    const refundData = {
      payment_intent: paymentIntentId,
      reason
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripeInstance.refunds.create(refundData);
    console.log('✅ Remboursement créé avec succès:', refund.id);
    return refund;
  } catch (error) {
    console.error('❌ Erreur lors de la création du remboursement:', error.message);
    throw error;
  }
};

exports.getPaymentIntent = async (paymentIntentId) => {
  try {
    const stripeInstance = initializeStripe();
    if (!stripeInstance) {
      throw new Error('Stripe n\'est pas configuré');
    }

    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du Payment Intent:', error.message);
    throw error;
  }
};

exports.isStripeConfigured = () => {
  return stripe !== null;
}; 