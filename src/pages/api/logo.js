import { NextResponse } from 'next/server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' })
  }

  const { brandName } = req.body

  if (!brandName) {
    return res.status(400).json({ error: 'brandName is required' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `A modern, minimalist logo for a brand called "${brandName}". White background, centered icon, clean typography.`,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'OpenAI logo generation failed' })
    }

    const base64 = data.data[0].b64_json
    res.status(200).json({ image: base64 })
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong generating the logo' })
  }
}
