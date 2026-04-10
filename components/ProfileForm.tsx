'use client'

import { useState } from 'react'
import type { UserProfile } from '@/types'

const OCCASIONS = ['Работа', 'Свидание', 'Прогулка', 'Вечеринка', 'Спорт', 'Путешествие', 'Ужин', 'Casual']
const STYLES = ['Минимализм', 'Streetwear', 'Классика', 'Casual', 'Авангард', 'Романтика', 'Бохо', 'Офис']
const BUDGETS = ['до $100', '$100–300', '$300–700', '$700+']
const COLORS = ['Нейтральные', 'Яркие', 'Пастельные', 'Монохром', 'Без разницы']

export default function ProfileForm({ onSubmit }: { onSubmit: (p: UserProfile) => void }) {
  const [gender, setGender] = useState('Женский')
  const [age, setAge] = useState('')
  const [occasion, setOccasion] = useState('')
  const [styles, setStyles] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [colorPrefs, setColorPrefs] = useState('')

  const toggleStyle = (s: string) =>
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const canSubmit = occasion && styles.length > 0 && budget

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit({ gender, age, occasion, styles, budget, colorPrefs })
  }

  return (
    <div>
      <h2 className="section-title mb-1">Расскажи о себе</h2>
      <p className="text-sm text-stone-400 mb-8 font-light">
        ИИ-стилист подберёт образ и найдёт вещи в магазинах
      </p>

      {/* Gender + Age */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="label mb-2">Пол</p>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-400"
          >
            <option>Женский</option>
            <option>Мужской</option>
            <option>Унисекс</option>
          </select>
        </div>
        <div>
          <p className="label mb-2">Возраст</p>
          <input
            type="number"
            placeholder="25"
            value={age}
            onChange={e => setAge(e.target.value)}
            min={14} max={80}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-stone-400"
          />
        </div>
      </div>

      {/* Occasion */}
      <div className="mb-6">
        <p className="label mb-2">Повод <span className="text-red-400">*</span></p>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map(o => (
            <button key={o} onClick={() => setOccasion(o)} className={`chip ${occasion === o ? 'active' : ''}`}>
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Style */}
      <div className="mb-6">
        <p className="label mb-2">Стиль (можно несколько) <span className="text-red-400">*</span></p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(s => (
            <button key={s} onClick={() => toggleStyle(s)} className={`chip ${styles.includes(s) ? 'active' : ''}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <p className="label mb-2">Цветовые предпочтения</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColorPrefs(c)} className={`chip ${colorPrefs === c ? 'active' : ''}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mb-8">
        <p className="label mb-2">Бюджет на образ <span className="text-red-400">*</span></p>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map(b => (
            <button key={b} onClick={() => setBudget(b)} className={`chip ${budget === b ? 'active' : ''}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} className="btn-primary">
        Создать образ с ИИ →
      </button>
    </div>
  )
}
