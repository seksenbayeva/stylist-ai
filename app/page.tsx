'use client'

import { useState } from 'react'
import ProfileForm from '@/components/ProfileForm'
import OutfitView from '@/components/OutfitView'
import ShopView from '@/components/ShopView'
import type { UserProfile, OutfitResponse, Step } from '@/types'

const STEPS: { id: Step; label: string }[] = [
  { id: 'profile', label: 'Профиль' },
  { id: 'outfit', label: 'Образ' },
  { id: 'shop', label: 'Магазины' },
]

export default function Home() {
  const [step, setStep] = useState<Step>('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [outfit, setOutfit] = useState<OutfitResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stepIndex = STEPS.findIndex(s => s.id === step)

  async function handleGenerateOutfit(p: UserProfile) {
    setProfile(p)
    setStep('outfit')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setOutfit(data)
    } catch {
      setError('Не удалось создать образ. Проверь API ключи.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setStep('profile')
    setOutfit(null)
    setProfile(null)
    setError('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-stone-100 px-5 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl tracking-tight">
          Styl<span className="italic text-stone-400">ist</span> AI
        </h1>
        <div className="flex items-center gap-3">
          {/* Steps */}
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`step-dot ${i === stepIndex ? 'active' : i < stepIndex ? 'done' : ''}`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-xs ${i === stepIndex ? 'text-stone-700 font-medium' : 'text-stone-400'}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className="w-5 h-px bg-stone-200" />}
              </div>
            ))}
          </div>
          <span className="text-xs font-medium tracking-widest uppercase px-2.5 py-1 bg-stone-900 text-stone-50 rounded-full">
            Beta
          </span>
        </div>
      </header>

      {/* Mobile steps */}
      <div className="sm:hidden flex items-center gap-2 px-5 py-3 border-b border-stone-100 bg-white overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 shrink-0">
            <div className={`step-dot ${i === stepIndex ? 'active' : i < stepIndex ? 'done' : ''}`}>
              {i < stepIndex ? '✓' : i + 1}
            </div>
            <span className={`text-xs ${i === stepIndex ? 'text-stone-700 font-medium' : 'text-stone-400'}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-stone-200" />}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 'profile' && (
          <ProfileForm onSubmit={handleGenerateOutfit} />
        )}

        {step === 'outfit' && (
          <OutfitView
            outfit={outfit}
            loading={loading}
            profile={profile!}
            onShop={() => setStep('shop')}
            onRegenerate={() => profile && handleGenerateOutfit(profile)}
            onBack={handleReset}
          />
        )}

        {step === 'shop' && outfit && (
          <ShopView
            outfit={outfit}
            onBack={() => setStep('outfit')}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="text-center py-5 text-xs text-stone-400 border-t border-stone-100">
        Поиск через Google Shopping · SerpAPI · Claude AI
      </footer>
    </div>
  )
}
