import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourses, setExpandedCourses] = useState({}); // NEW: track per-order expanded course
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:1337/api/orders?filters[email][$eq]=${user.primaryEmailAddress.emailAddress}&populate[0]=courses&populate[courses][populate][0]=lessons&populate[courses][populate][lessons][populate][0]=video`
        );
        const data = await res.json();
        setOrders(data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isSignedIn]);

  // Toggle a course within a specific order
  const toggleCourse = (orderId, courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [orderId]: prev[orderId] === courseId ? null : courseId
    }));
  };

  return (
    <>
      <Header />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>

        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border rounded shadow ">
                <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
                <ul className="text-sm text-gray-700 ">
                  {order.courses?.map((course) => (
                    <li key={course.id} className="my-4 text-2xl">
                      <button
                        onClick={() => toggleCourse(order.id, course.id)}
                         className="w-full text-left font-medium text-blue-600 cursor-pointer"
                      >
                        📘 {course.title} - ${course.price}
                      </button>

                      {expandedCourses[order.id] === course.id && (
                        <ul className="mt-2 pl-4">
                          {course.lessons?.map((lesson) => (
                            <li key={lesson.id} className="mb-3">
                              <p className="font-semibold">{lesson.title}</p>
                              {lesson.video?.url && (
                                <div className="mt-1">
                                  <video
                                    width="100%"
                                    height="auto"
                                    controls
                                    className="rounded-md"
                                  >
                                    <source
                                      src={`http://localhost:1337${lesson.video.url}`}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                  <a
                                    href={`http://localhost:1337${lesson.video.url}`}
                                    download
                                    className="text-blue-500 underline mt-1 inline-block"
                                  >
                                    Download Video
                                  </a>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
