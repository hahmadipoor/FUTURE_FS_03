// pages/api/recommend.js

export default async function handler(req, res) {

  if (req.method !== 'POST') return res.status(405).end()
  const { currentCourse, allCourses } = req.body

  if (!currentCourse || !allCourses) {
    return res.status(400).json({ message: 'Missing data' })
  }

  const prompt = `You're an educational advisor. Based on the following course, recommend 3 other similar courses from the list.
              Current course:
              Title: ${currentCourse.title}
              Description: ${currentCourse.description}
              Available courses:${allCourses.map(c => `- ${c.title}: ${c.description}`).join('\n')}
              Return a list of 3 recommended course titles only.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    })

    const data = await response.json()
    const recommendations = data.choices?.[0]?.message?.content
      ?.split('\n')
      .map(line => line.replace(/^[-*\d.]\s*/, '').trim())
      .filter(Boolean)

    res.status(200).json({ recommendations })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch recommendations' })
  }
}
