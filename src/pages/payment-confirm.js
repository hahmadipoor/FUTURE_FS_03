'use client'

import { useRouter } from 'next/router';
import React from 'react'

function PaymentConfirm() {

	const router = useRouter();

	return (
		<div className='flex flex-col items-center justify-center px-5 mt-4 gap-4'>
			<h1 className='text-4xl'> Payment Successful</h1>
			<div className="flex justify-end" >
				<button onClick={() => router.push(`/orders`)} className="block px-5 py-3 text-sm text-gray-100 transition bg-gray-700 rounded hover:bg-gray-600">
  					Go to Order Page
				</button>  
			</div>
		</div>
	)
}

export default PaymentConfirm
