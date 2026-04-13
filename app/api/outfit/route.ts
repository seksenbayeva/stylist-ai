import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const profile = await req.json()

    // 1. Генерация текста — GPT-4o
    const textRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `Ты профессиональный стилист. Составь модный образ и верни ТОЛЬКО валидный JSON без markdown.
Пол: ${profile.gender}, Возраст: ${profile.age || 'не указан'}, Повод: ${profile.occasion}, Стиль: ${profile.styles.join(', ')}, Бюджет: ${profile.budget}, Цвета: ${profile.colorPrefs || 'любые'}

Формат (только JSON):
{
  "summary": "краткое описание образа на русском",
  "items": [{"category":"top","name":"...","description":"...","searchQuery":"english search query","color":"...","priceRange":"$XX-XX"}],
  "stylistTip": "совет стилиста на русском"
}`
        }]
      })
    })

    const textData = await textRes.json()
    console.log('OpenAI response:', JSON.stringify(textData))
    const raw = textData.choices[0].message.content
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const outfit = JSON.parse(clean)

    // Строим flat lay промпт из реальных вещей
    const itemDescriptions = (outfit.items || [])
      .map((item: { name: string; color: string }) => `${item.color} ${item.name}`)
      .join(', ')

    const flatLayPrompt = `Flat lay fashion outfit photography on pure white background. Individual clothing items neatly arranged separately without overlapping: ${itemDescriptions}. Top-down bird's eye view, each piece laid flat. Styled exactly like a Pinterest outfit mood board. No people, no mannequins, no body parts. Professional fashion product photography, soft diffused lighting, subtle drop shadows, high resolution, clean white background, luxury fashion style.`

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
          prompt: flatLayPrompt,
          n: 1,
          size: '1024x1792',
          quality: 'hd',
          style: 'natural',
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