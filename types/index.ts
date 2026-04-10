export interface UserProfile {
  gender: string
  age: string
  occasion: string
  styles: string[]
  budget: string
  colorPrefs: string
}

export interface OutfitItem {
  category: 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessories'
  name: string
  description: string
  searchQuery: string
  color: string
  priceRange: string
}

export interface OutfitResponse {
  summary: string
  imagePrompt?: string
  imageUrl?: string        
  items: OutfitItem[]
  stylistTip: string
}

export interface Product {
  title: string
  price: string
  source: string
  link: string
  thumbnail: string
  rating?: number
  reviews?: number
  category: string
}

export type Step = 'profile' | 'outfit' | 'shop'
