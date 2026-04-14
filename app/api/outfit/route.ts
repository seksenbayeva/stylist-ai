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
        messages: [
          {
            role: 'user',
            content: `Ты профессиональный стилист. Составь образ и верни ТОЛЬКО JSON без markdown.

Пол: ${profile.gender}
Повод: ${profile.occasion}
Стиль: ${profile.styles.join(', ')}
Бюджет: ${profile.budget}

Формат:
{
  "summary": "описание образа",
  "imagePrompt": "fashion flat lay outfit photography, exactly one of each clothing item laid flat separately on pure white background, each item appears only once, no duplicates, no repetition, items neatly spaced apart without overlapping, top-down view, soft shadows, professional product photography, 4K, no model, no person, no mannequin, no body parts",
  "items": [
    {
      "category": "top",
      "name": "...",
      "description": "...",
      "searchQuery": "english query",
      "color": "...",
      "priceRange": "$XX–XX"
    }
  ],
  "stylistTip": "совет"
}`
          }
        ]
      })
    })

    const textData = await textRes.json()

    const raw = textData.choices?.[0]?.message?.content || ''
    const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim()

    const outfit = JSON.parse(clean)

    // 2. Генерация картинки — DALL·E
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
          size: '1024x1024'
        })
      })

      const imageData = await imageRes.json()
      outfit.imageUrl = imageData.data?.[0]?.url || null

    } catch (err) {
      console.error('Image generation error:', err)
      outfit.imageUrl = null
    }

    return NextResponse.json(outfit)

  } catch (err) {
    console.error('Main error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// test change