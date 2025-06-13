'use client'
import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm'
import { useSearchParams } from 'next/navigation';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY);

function Checkout() {

  const searchParams = useSearchParams();
  const [amount, setAmount] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  
  useEffect(() => {
    const value = searchParams.get('amount');
    if (value) {
      const amt = Number(value);
      setAmount(amt);
      // Create Payment Intent
      fetch('/api/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt }),
      })
        .then(res => res.json())
        .then(data => {
          setClientSecret(data.client_secret); // assuming API returns client_secret as raw string
      });
    }
  }, [searchParams]);
  
  if (!clientSecret) 
      return <p className="text-center mt-10">Preparing checkout...</p>;  
  if (!amount) 
    return <p className="text-center mt-10">Loading...</p>;

  const options = {
    clientSecret,
    appearance: { theme: 'stripe' }
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}

export default Checkout;
