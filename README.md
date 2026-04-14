# Stylist AI 👗

Персональный ИИ-стилист: создаёт образ через Claude AI и ищет вещи в Google Shopping через SerpAPI.

## Стек

- **Next.js 16** (App Router)
- **Tailwind CSS**
- **OpenAI GPT-4o-mini** (генерация образа)
- **DALL·E 3** (генерация фото образа)
- **SerpAPI** (Google Shopping поиск)

---

## Запуск за 5 минут

### 1. Установи зависимости

```bash
npm install
```

### 2. Создай файл с ключами

```bash
cp .env.local.example .env.local
```

Открой `.env.local` и вставь свои ключи:

```
ANTHROPIC_API_KEY=sk-ant-...   # console.anthropic.com
SERPAPI_KEY=...                 # serpapi.com/manage-api-key
```

### 3. Запусти локально

```bash
npm run dev
```

Открой http://localhost:3000

---

## Деплой на Vercel (бесплатно)

```bash
npm install -g vercel
vercel
```

Или подключи GitHub репо на vercel.com — деплой автоматический.

**Важно:** В настройках Vercel добавь переменные окружения:

- `ANTHROPIC_API_KEY`
- `SERPAPI_KEY`

---

## Структура проекта

```
stylist-ai/
├── app/
│   ├── api/
│   │   ├── outfit/route.ts   ← OpenAI (генерация образа + DALL·E)
│   │   └── search/route.ts   ← SerpAPI (поиск товаров)
│   ├── page.tsx              ← Главная страница
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ProfileForm.tsx       ← Форма профиля
│   ├── OutfitView.tsx        ← Просмотр образа
│   └── ShopView.tsx          ← Магазины (реальные товары)
├── public/
│   └── favicon.svg
├── types/index.ts
└── .env.local.example
```

---

## Что работает

- Форма профиля (пол, возраст, повод, стиль, бюджет, цвета)
- ИИ генерирует образ (5-6 вещей с описаниями)
- Генерация фото образа в стиле flat lay через DALL·E 3
- Поиск каждой вещи в Google Shopping через SerpAPI
- Карточки товаров с фото, ценой, рейтингом, ссылкой
- Фильтрация по категориям (верх / низ / обувь / аксессуары)
- Мобильная адаптация

## Что можно добавить

- [ ] Сохранение образов (Supabase / Clerk)
- [ ] Авторизация пользователей
- [ ] Избранные товары
- [ ] Фильтр по магазинам (Zara, H&M, Farfetch...)
- [ ] Партнёрские ссылки Amazon / Farfetch
