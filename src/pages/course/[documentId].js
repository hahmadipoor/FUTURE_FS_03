import Header from '../../components/Header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function CourseDetails() {
  const { documentId } = useRouter().query
  const [course, setCourse] = useState(null)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    if (!documentId) return

    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:1337/api/courses/${documentId}?populate[lessons][populate][0]=video&populate[instructor][populate][0]=avatar&populate=cover_image`)
        const data = await res.json()
        setCourse(data.data)

        const courseText = {
          title: data.data.title,
          description: Array.isArray(data.data.description)
            ? data.data.description.flatMap(block => block.children?.map(child => child.text) || []).join(' ')
            : data.data.description,
          lessons: data.data.lessons?.map(lesson => lesson.title).join(', ')
        }

        // Send cleaned text to summary
        const summaryRes = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseText })
        })

        const summaryData = await summaryRes.json()

        if (summaryRes.ok) {
          setSummary(summaryData.summary)
        } else {
          setError(summaryData.message || 'Failed to fetch summary')
        }

        // Fetch all courses for recommendation
        const allRes = await fetch('http://localhost:1337/api/courses?populate=cover_image')
        const allData = await allRes.json()

        const current = {
          title: data.data.title,
          description: courseText.description
        }

        const all = allData.data.map(course => ({
          title: course.title,
          description: Array.isArray(course.description)
            ? course.description.flatMap(block => block.children?.map(child => child.text) || []).join(' ')
            : course.description,
          id: course.id,
          documentId: course.documentId,
          cover: course.cover_image?.url
        }))

        const recRes = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentCourse: current, allCourses: all })
        })
        const recData = await recRes.json()
        const aiTitles = recData.recommendations || []
        const targetWords = data.data.title.toLowerCase().split(/\s+/)
        const matched = all.filter(c => {
                const otherWords = c.title.toLowerCase().split(/\s+/)
                const wordMatch = targetWords.some(word => otherWords.includes(word))
                const aiMatch = aiTitles.some(ai => c.title.toLowerCase().includes(ai.toLowerCase()))
                return (wordMatch || aiMatch) && c.id !== data.data.id
        })
        
        setRecommendations(matched)
      } catch (err) {
        setError('Something went wrong while fetching course, summary, or recommendations')
      }
    }

    fetchCourse()
  }, [documentId])

  if (!course) return <p className="p-6 text-lg">Loading...</p>

  const c = course

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Course Info */}
        <section className="relative h-96 w-full overflow-hidden rounded-xl shadow-lg">
          <img src={`http://localhost:1337${c.cover_image?.url}`} alt={c.title} className="rounded-2xl absolute w-full h-full object-cover"/>
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

        {/* Summary */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Course Summary (AI)</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary || 'Loading summary...'}</p>
          )}
        </section>

        {/* Instructor */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">About this course</h2>
          <p className="text-gray-700 leading-relaxed">{c.description[0]?.children[0]?.text}</p>
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-1">Instructor</h3>
            <p className="text-sm text-gray-600">
              {Array.isArray(c.instructor?.bio)
                ? c.instructor.bio.flatMap(block => block.children?.map(child => child.text) || []).join('')
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
                {lesson.video?.url ? (
                  <video controls className="rounded-lg w-full mt-auto">
                    <source src={`http://localhost:1337${lesson.video.url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No video available</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">You might also like</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map(course => (
                <li key={course.id} className="bg-gray-50 rounded-lg shadow-md p-4">
                  {course.cover && (
                    <img src={`http://localhost:1337${course.cover}`} className="w-full h-32 object-cover rounded-md mb-2" />
                  )}
                  <h3 className="text-lg font-medium">{course.title}</h3>
                  <a href={`/course/${course.documentId}`} className="text-sm text-blue-600 mt-2 inline-block">View Course</a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  )
}
