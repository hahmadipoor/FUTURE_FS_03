import Header from '@/components /Header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function CourseDetails() {
  const { documentId } = useRouter().query
  const [course, setCourse] = useState(null)

  useEffect(() => {

    if (!documentId) 
      return
    fetch(`http://localhost:1337/api/courses/${documentId}?populate[lessons][populate][0]=video&populate[instructor][populate][0]=avatar&populate=cover_image`)
      .then(res => res.json())
      .then(data => setCourse(data.data))
  }, [documentId])

  if (!course) 
    return <p className="p-6 text-lg">Loading...</p>

  const c = course

  return (
    <>
    <Header />
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
    {/* Course Info */}
      <section className="relative h-96 w-full overflow-hidden rounded-xl shadow-lg">
        <img src={`http://localhost:1337${c.cover_image?.url}`} alt={c.title} className="rounded-2xl absolute w-full h-full "/>
        <div className="relative z-10 h-full flex flex-col justify-end p-8 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h1 className="text-4xl font-bold">{c.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            {c.instructor?.avatar?.url && (
              <img src={`http://localhost:1337${c.instructor.avatar.url}`} alt={c.instructor.name} className="w-10 h-10 rounded-full border-2 border-white"/>
            )}
          <p className="text-sm">By {c.instructor?.name}</p>
          </div>
        </div>
      </section>

  {/*Instructor */}
  <section className="bg-white rounded-xl shadow p-6 space-y-4">
    <h2 className="text-2xl font-semibold text-gray-800">About this course</h2>
    <p className="text-gray-700 leading-relaxed">{c.description[0]?.children[0]?.text}</p>
    <div className="border-t pt-4 mt-4">
      <h3 className="text-lg font-medium text-gray-800 mb-1">Instructor</h3>
      <p className="text-sm text-gray-600">
        {Array.isArray(c.instructor?.bio)
          ? c.instructor.bio
            .flatMap(block => block.children?.map(child => child.text) || [])
            .join('')
          : 'No bio available'}
      </p>
    </div>
  </section>

 {/* Lessons */}
  <section className="space-y-4">
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Lessons</h2>
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {c.lessons?.map(lesson => (
        <li key={lesson.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
          <h3 className="text-lg font-medium mb-2">{lesson.title}</h3>
          {lesson.video?.url ? 
          (
            <video controls className="rounded-lg w-full mt-auto">
              <source src={`http://localhost:1337${lesson.video.url}`} type="video/mp4" />
              Your browser does not support the video tag.
              </video>
          ) : 
          (
            <p className="text-sm text-gray-500 mt-2">No video available</p>
          )}
       </li>
      ))}
    </ul>
  </section>
    </main>      
    </>
  )
}
