
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const course = req.body.courseText
  if (!course) return res.status(400).json({ summary: 'Missing course data' })

  const prompt = `
This is a course overview. Generate a helpful summary for students who are considering taking the course.

Course Title: ${course.title}
Description: ${course.description}
Lessons: ${course.lessons}
`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000/', // Your app URL
        'X-Title': 'My Udemy Clone'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct', // Free, fast, solid
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5
      })
    })

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content || 'Could not generate summary.'
    res.status(200).json({ summary })
  } catch (err) {
    console.error('OpenRouter API error:', err)
    res.status(500).json({ summary: 'Error generating summary' })
  }
}
