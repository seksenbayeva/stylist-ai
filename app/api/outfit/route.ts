import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const profile = await req.json()

    // 1. Генерация текста — GPT-4o-mini
    const textRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Ты профессиональный стилист. Составь образ и верни ТОЛЬКО JSON без markdown.
Пол: ${profile.gender}, Повод: ${profile.occasion}, Стиль: ${profile.styles.join(', ')}, Бюджет: ${profile.budget}

Формат:
{
  "summary": "описание образа",
  "imagePrompt": "fashion outfit collage, individual clothing items overlapping each other on pure white background, no people, no mannequin, pinterest outfit mood board style, each item photographed separately and composed together, items include all pieces from the outfit with their colors and materials, accessories placed around the clothing, clean white background, high quality fashion photography",
  "items": [{"category":"top","name":"...","description":"...","searchQuery":"english query","color":"...","priceRange":"$XX–XX"}],
  "stylistTip": "совет"
}`
      }]
      })
    })

    const textData = await textRes.json()
    const raw = textData.choices[0].message.content
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const outfit = JSON.parse(clean)

    // 2. Генерация картинки — DALL·E 3
    try {
      const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: outfit.imagePrompt,
          n: 1,
          size: '1024x1792',
        })
      })

      const imageData = await imageRes.json()
      outfit.imageUrl = imageData.data?.[0]?.url || null
    } catch {
      outfit.imageUrl = null
    }

    return NextResponse.json(outfit)

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}