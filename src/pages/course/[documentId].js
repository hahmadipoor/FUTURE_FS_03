// pages/course/[id].js

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function CourseDetails() {
  
  const { documentId } = useRouter().query
  const [course, setCourse] = useState(null)

  useEffect(() => {
    if (!documentId) return
    console.log(documentId);
    
  fetch(`http://localhost:1337/api/courses/${documentId}?populate[lessons][populate][0]=video&populate[instructor][populate][0]=avatar&populate=cover_image`)
    .then(res => res.json())
    .then(data => setCourse(data.data) )
  }, [documentId])

  if (!course) 
    return <p className="p-4">Loading...</p>

  const c = course // shorthand

  return (
    <main className="max-w-4xl mx-auto p-6">
      <img src={`http://localhost:1337${c.cover_image?.url}`} className="rounded-xl w-full h-64 object-cover mb-4"/>
      <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
      <p className="text-gray-500 mb-2">by {c.instructor?.name}</p>
      <p className="mb-4 text-gray-700">{c.description[0]?.children[0]?.text}</p>
      <img src={`http://localhost:1337${c.instructor?.avatar?.url}`} className="rounded-4xl w-1/6 h-1/6 object-cover mb-4"/>
      <h2 className="text-xl font-semibold mt-6 mb-2">Lessons</h2>
      <ul className="space-y-2">
        {c.lessons?.map(lesson => (
          <li key={lesson.id} className="p-3 border rounded-lg shadow-sm">
            <p className="font-medium">{lesson.title}</p>
            <video controls className="mt-2 rounded w-full max-h-64">
              <source src={`http://localhost:1337${lesson.video?.url}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </li>
        ))}
      </ul>
    </main>
  )
}



