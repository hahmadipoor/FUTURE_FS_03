'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function PaymentConfirm({params}) {

	const [orderDetails, setOrderDetails]=useState({})
	const [orderProducts, setOrderProducts]=useState([])

	useEffect(()=>{

		if(localStorage.getItem("orderId")){
			
			OrderApis.getOrderById(localStorage.getItem("orderId")).then((res) => {
				console.log(res.data.data.products);
				
				setOrderDetails(res.data.data);
      			setOrderProducts(res.data.data.products)
    		});	
		}
	},[])

	// useEffect(() => {
		
	// 	getOrderById_();
  	// }, [params?.orderId]);


	// const getOrderById_ = ()=>{

	// 	OrderApis.getOrderById(params?.orderId).then((res) => {
	// 		setOrderDetails(res.data.data);
    //   		setOrderProducts(res.data.data.products)
    // 	});
	// }

	return (
		<div className='flex flex-col items-center justify-center px-5 mt-4'>
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
            payment was Successful
		</div>
	)
}

export default PaymentConfirm
