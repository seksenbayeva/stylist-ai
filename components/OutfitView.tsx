'use client'

import type { OutfitResponse, UserProfile } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  top: 'Верх',
  bottom: 'Низ',
  shoes: 'Обувь',
  outerwear: 'Верхняя одежда',
  accessories: 'Аксессуары',
}

const CATEGORY_ICONS: Record<string, string> = {
  top: '👕',
  bottom: '👖',
  shoes: '👟',
  outerwear: '🧥',
  accessories: '👜',
}

interface Props {
  outfit: OutfitResponse | null
  loading: boolean
  profile: UserProfile
  onShop: () => void
  onRegenerate: () => void
  onBack: () => void
}

export default function OutfitView({ outfit, loading, profile, onShop, onRegenerate, onBack }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
        <p className="font-display text-lg italic text-stone-400">
          Стилист подбирает образ...
        </p>
        <p className="text-xs text-stone-400">{profile.occasion} · {profile.styles.join(', ')}</p>
      </div>
    )
  }

  if (!outfit) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-700 text-sm transition-colors">
          ← Назад
        </button>
      </div>

      <h2 className="section-title mb-1">Твой образ готов</h2>
      <p className="text-sm text-stone-400 mb-6">
        {profile.occasion} · {profile.styles.join(', ')} · {profile.budget}
      </p>

      {/* Outfit Image */}
      {outfit.imageUrl && (
        <div className="mb-5 rounded-2xl overflow-hidden border border-stone-100 bg-stone-100 aspect-[3/4] relative">
          <img
            src={outfit.imageUrl}
            alt="Образ"
            className="w-full h-full object-cover"
            onLoad={(e) => {
              const el = e.target as HTMLImageElement
              el.style.opacity = '1'
              const overlay = el.parentElement?.querySelector('.img-overlay') as HTMLElement
              if (overlay) overlay.style.display = 'none'
            }}
            onError={(e) => {
              const el = e.target as HTMLImageElement
              el.style.display = 'none'
            }}
            style={{ opacity: 0, transition: 'opacity 0.5s' }}
          />
          <div className="img-overlay absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
              <p style={{ color: '#bbb', fontSize: '13px' }}>Генерация образа...</p>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/80 backdrop-blur rounded-full text-xs text-stone-500">
            ИИ-визуализация
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="card p-5 mb-5 bg-stone-50 border-stone-100">
        <p className="label mb-2">Рекомендация стилиста</p>
        <p className="text-sm leading-relaxed text-stone-700">{outfit.summary}</p>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-5">
        {outfit.items?.map((item, i) => (
          <div key={i} className="card p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-lg shrink-0">
              {CATEGORY_ICONS[item.category] || '👔'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
                  {CATEGORY_LABELS[item.category] || item.category}
                </p>
                <span className="text-xs text-stone-400 shrink-0">{item.priceRange}</span>
              </div>
              <p className="text-sm font-medium text-stone-800 mb-0.5">{item.name}</p>
              <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>
              <p className="text-xs text-stone-300 mt-1 font-mono">🔍 {item.searchQuery}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      {outfit.stylistTip && (
        <div className="p-4 rounded-xl border-l-2 border-stone-300 bg-stone-50 mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-1">Совет стилиста</p>
          <p className="text-sm text-stone-600 italic">{outfit.stylistTip}</p>
        </div>
      )}

      <button onClick={onShop} className="btn-primary mb-3">
        Найти в магазинах →
      </button>
      <button onClick={onRegenerate} className="btn-outline w-full">
        Другой вариант
      </button>
    </div>
  )
}