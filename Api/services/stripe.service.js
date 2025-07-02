const Stripe = require('stripe');

let stripe = null;

// Initialiser Stripe seulement si la clé API est disponible
if (process.env.STRIPE_SECRET_KEY) {
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
}

exports.createPaymentIntent = async (amount, currency = 'eur') => {
  if (!stripe) {
    throw new Error('Stripe n\'est pas configuré. Vérifiez STRIPE_SECRET_KEY dans vos variables d\'environnement.');
  }
  
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency
  });
}; 