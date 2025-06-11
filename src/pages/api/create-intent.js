import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "USD",
    });

    return res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('[Stripe Error]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
