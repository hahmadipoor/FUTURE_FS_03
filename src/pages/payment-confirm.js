'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function PaymentConfirm() {

	const router = useRouter();

	// const [order, setOrder]=useState([])
	// useEffect(()=>{
	// 	if(localStorage.getItem("orderId")){
	// 		getOrderById();
	// 	}
	// },[])
	// const getOrderById= ()=>{
	// 	fetch('http://localhost:1337/api/orders?populate=*')
    //   		.then(res => res.json())
    //   		.then(data => setOrders(data.data));
	// }

	return (
		<div className='flex flex-col items-center justify-center px-5 mt-4 gap-4'>
			{/* 
            <Image src='/verified.gif' alt='check' width={130} height={130}/>
			<h2 className='text-[24px]'>Payment Successful !</h2>
			<h2 className='text-[17px] text-center mt-6 text-gray-500'>We sent an email with your order confirmation along with Digital Content</h2>
			{orderProducts.length}
			{
				orderProducts.map((product)=>(
					product.files.map((file)=><a href={`http://localhost:1337${file.url}`} className='p-2 mt-6 text-white rounded-md bg-primary'>Download Link</a>)
				))
			}
            */}
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
