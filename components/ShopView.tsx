'use client'

import { useEffect, useState } from 'react'
import type { OutfitResponse, Product } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  top: 'Верх',
  bottom: 'Низ',
  shoes: 'Обувь',
  outerwear: 'Верхняя одежда',
  accessories: 'Аксессуары',
  all: 'Все',
}

interface Props {
  outfit: OutfitResponse
  onBack: () => void
  onReset: () => void
}

export default function ShopView({ outfit, onBack, onReset }: Props) {
  const [grouped, setGrouped] = useState<Record<string, Product[]>>({})
  const [all, setAll] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    async function search() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: outfit.items }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setGrouped(data.grouped || {})
        setAll(data.all || [])
      } catch {
        setError('Ошибка поиска. Проверь SERPAPI_KEY.')
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [outfit])

  const filters = ['all', ...Object.keys(grouped)]
  const shown: Product[] = filter === 'all' ? all : (grouped[filter] || [])

  return (
    <div>
      <button onClick={onBack} className="text-stone-400 hover:text-stone-700 text-sm transition-colors mb-2">
        ← К образу
      </button>

      <h2 className="section-title mb-1">Найдено в магазинах</h2>
      <p className="text-sm text-stone-400 mb-5">Google Shopping · обновлено сейчас</p>

      {/* Live badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-medium mb-5">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        Поиск через SerpAPI
      </div>

      {/* Filters */}
      {!loading && filters.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip shrink-0 ${filter === f ? 'active' : ''}`}
            >
              {CATEGORY_LABELS[f] || f}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm mb-5">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-[3/4] w-full" />
              <div className="p-3 space-y-2">
                <div className="skeleton h-3 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-4 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {!loading && shown.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shown.map((p, i) => (
            <div key={i} className="product-card">
              <div className="relative">
                {p.thumbnail ? (
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full aspect-[3/4] object-cover bg-stone-100"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-stone-100 flex items-center justify-center text-4xl">
                    🛍️
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-stone-600 border border-stone-100">
                  {p.source}
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">
                  {CATEGORY_LABELS[p.category] || p.category}
                </p>
                <p className="text-xs font-medium text-stone-800 leading-snug line-clamp-2 mb-1">{p.title}</p>
                {p.rating && (
                  <p className="text-xs text-amber-500 mb-1">
                    {'★'.repeat(Math.round(p.rating))} <span className="text-stone-400">{p.rating} ({p.reviews})</span>
                  </p>
                )}
                <p className="text-sm font-semibold text-stone-900 mb-2">{p.price}</p>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-2 bg-stone-900 text-stone-50 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
                >
                  Купить →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && shown.length === 0 && !error && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">Товары не найдены. Попробуй другой фильтр.</p>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button onClick={onReset} className="btn-outline">
          Новый образ
        </button>
      </div>
    </div>
  )
}
