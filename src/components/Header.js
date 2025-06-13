'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { UserButton } from "@clerk/nextjs";
import { ShoppingCart } from 'lucide-react'
import Cart from './Cart'
import { useCart } from '@/lib/CartContext'

function Header() {

	const [isSignInPage, setIsSignInPage] = useState(false)
	const [openCart, setOpenCart] = useState(false)
	const { cart, setCart } = useCart()
	const { user, isSignedIn } = useUser();

	useEffect(() => {

	  if (isSignedIn && user) {
    	
      const fetchCart = async () => {			
      try {
				const res = await fetch(`http://localhost:1337/api/carts?populate[courses][populate]=cover_image&filters[email][$eq]=${user.primaryEmailAddress.emailAddress}`);
				const data = await res.json();
        		if (data.data && data.data.length > 0) {
          			setCart(data.data[0].courses);
        		}
      			} catch (err) {
        			console.error("Error fetching cart:", err);
    			}
      		};

	    fetchCart();
      }
    }, [user, isSignedIn]);

	useEffect(() => {

	  setIsSignInPage(window?.location?.href.toString().includes('sign-in') || window?.location?.href.toString().includes('sign-up'))
	}, [])


	 return !isSignInPage && (
    <>
      {openCart && <Cart onClose={() => setOpenCart(false)} />}
      <header className="bg-white dark:bg-gray-900">
        <div className="flex items-center h-16 max-w-screen-xl gap-8 px-4 mx-auto shadow-md sm:px-6 lg:px-8">
          <div className="flex items-center justify-end flex-1 md:justify-between ">
            <nav aria-label="Global" className="hidden md:block">
             <ul className="flex items-center gap-6 text-sm">
                <li>
                    <a href="/" className="flex items-center">
                        <img src="/logo3.png" alt="Learnumy Logo" className="h-24 object-contain" />
                    </a>
                </li>
                <li>
                  <a href="/course" className="text-gray-500 hover:text-gray-700 dark:text-white">Courses</a>
                </li>
                <li>
                    <a href="/orders" className="text-gray-500 hover:text-gray-700 dark:text-white">MyOrders</a>
                </li>
            </ul>
            </nav>
            <div className="flex items-center gap-4">
              {!isSignedIn ? (
                <div className="sm:flex sm:gap-4">
                  <a href="/sign-in" className="hidden sm:block rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 dark:bg-gray-800 dark:text-white">Login</a>
                  <a href="/sign-up" className="hidden sm:block rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 dark:bg-gray-800 dark:text-white">Register</a>
                </div>
              ) : (
                <div className='flex items-center gap-5'>
                  <button onClick={() => setOpenCart(!openCart)} className="text-gray-600 hover:text-primary relative">
                    <ShoppingCart />
                    {cart?.length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">{cart.length}</span>
                    )}
                  </button>
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}


export default Header