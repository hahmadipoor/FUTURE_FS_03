import Header from '@/components /Header';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/CartContext';


export default function Home() {
  
  const [courses, setCourses] = useState([]);

  const { cart, setCart } = useCart();

  useEffect(() => {

    fetch('http://localhost:1337/api/courses?populate=*')
      .then(res => res.json())
      .then(data => setCourses(data.data));    
  }, []);

  const handleAddToCart = (course) => {
    // Prevent duplicates
   if (!cart.find((c) => c.id === course.id)) {
      setCart([...cart, course]);
    }
  };

  return (
    <>
      <Header />
      <main className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Explore Courses </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             
              {courses.map(course => {
                const { title, description, price, rating, instructor, cover_image } = course;
                return (
                  <div>
                    <Link href={`/course/${course.documentId}`}>
                      <div key={course.id} className="bg-white rounded-2xl shadow p-4">
                        <img src={`http://localhost:1337${cover_image?.url}`} alt={title} className="rounded-xl h-48 w-full object-cover"/>
                        <h2 className="text-xl font-semibold mt-4">{title}</h2>
                        <p className="text-sm text-gray-500 mb-1">{instructor?.name}</p>
                        <p className="text-sm text-gray-700">{description[0]?.children[0].text.slice(0,80)}...</p>
                        <div className="mt-2 flex justify-between text-sm">
                          <span>⭐ {rating}</span>
                          <span>${price}</span>
                        </div>
                      </div>
                    </Link>
                    <button  className="mt-3 px-4 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700" onClick={() => handleAddToCart(course)}>
                          Add to Cart
                    </button>
                  </div>
                  );
                })
              }
          </div>
      </main>
    </>
  );
}
