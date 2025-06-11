import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { useUser } from '@clerk/nextjs'


const CheckoutForm = ({ amount }) => {

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { cart, setCart } = useCart()
  const { user, isSignedIn } = useUser();

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!stripe || !elements) 
      return;
    setLoading(true);

    const {  error, paymentIntent } = await stripe.confirmPayment({
      elements,
      // confirmParams: {
      //   return_url: `http://localhost:3000/payment-confirm`,
      // },
      redirect: 'if_required'
    });

    if (error) {
      setErrorMessage(error.message);
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      await createOrder();      
    }
  };

  const createOrder = async () => {
   
    try {
      let courseIds = [];
      cart?.forEach(course => {
        courseIds.push(course.id)
		  })
      const res = await fetch('http://localhost:1337/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            email: user?.primaryEmailAddress?.emailAddress,  
            username: user?.fullName || user?.username,
            amount: amount,
            courses: courseIds, 
            // status: 'paid',
            // stripeId: paymentIntent.id,
          }
        }),
      });

      if (!res.ok) 
        throw new Error('Failed to create order in Strapi');
      console.log('✅ Order created successfully');
      setLoading(false);
      window.location.href = '/payment-confirm';
    } catch (err) {
      console.error('Error creating order:', err);
    }
	}

  return (
    <form onSubmit={handleSubmit} className="mx-32 md:mx-[320px] mt-12">
      <PaymentElement />
      <button type="submit" className="w-full p-2 mt-4 bg-teal-600 text-white rounded hover:bg-teal-700" disabled={loading || !stripe}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </form>
  );
};

export default CheckoutForm;
