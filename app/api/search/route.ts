import { NextRequest, NextResponse } from 'next/server'

const SERP_API_KEY = process.env.SERPAPI_KEY

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json()

    // Search for each outfit item in parallel
    const results = await Promise.all(
      items.map(async (item: { searchQuery: string; category: string; priceRange: string }) => {
        const params = new URLSearchParams({
          engine: 'google_shopping',
          q: item.searchQuery,
          api_key: SERP_API_KEY!,
          num: '6',
          hl: 'en',
          gl: 'us',
        })

        // Add price filter based on budget range
        if (item.priceRange) {
          const match = item.priceRange.match(/\$?(\d+)\s*[-–]\s*\$?(\d+)/)
          if (match) {
            params.append('tbs', `mr:1,price:1,ppr_min:${match[1]},ppr_max:${match[2]}`)
          }
        }

        try {
          const res = await fetch(`https://serpapi.com/search.json?${params}`)
          const data = await res.json()

          const products = (data.shopping_results || []).slice(0, 4).map((p: any) => ({
            title: p.title,
            price: p.price,
            source: p.source,
            link: p.product_link || p.link,
            thumbnail: p.thumbnail,
            rating: p.rating,
            reviews: p.reviews,
            category: item.category,
          }))

          return { category: item.category, products }
        } catch {
          return { category: item.category, products: [] }
        }
      })
    )

    // Group by category
    const grouped: Record<string, any[]> = {}
    results.forEach(({ category, products }) => {
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(...products)
    })

    return NextResponse.json({ grouped, all: results.flatMap(r => r.products) })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
