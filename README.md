# Смета

Приложение для работы со сметой в строительстве: составление, ведение и расчёт сметных документов.

Технические требования заказчика — в [постановке](./docs/requirements/README.md).

## Архитектура

Проект разделён на слои. `app/` — тонкие точки входа Next.js, бизнес-код живёт в `components`, `services`, `domain` и `data`.

```
app/              # маршруты Next.js — тонкие страницы; Route Handlers в app/api/
components/       # UI (React) — без исполнения бизнес-логики
services/         # сценарии — 'use server', связывает domain и data
domain/           # правила, сущности, интерфейсы репозиториев (чистый TS)
data/             # хранилище (Prisma)
```

Зависимости идут в одну сторону:

```
components  →  services  →  domain  ←  data
   (UI)      (сценарии)   (правила)  (хранилище)
```

Как с этим работать:

- Экран вызывает только Server Actions из `services/`.
- Из `domain` во фронт тянем **только типы**: `import type { … } from '@/domain/…'`. Функции, константы и правила домена UI не вызывает — их вызывают `services`.
- `components` не импортирует `data`. Prisma и SQL живут в `data/`, сервис берёт оттуда готовый репозиторий.
- `domain` ни от кого не зависит: ни от React, ни от Next, ни от Prisma.

Подробные правила слоёв, импортов и структуры папок — в [AGENTS.md](./AGENTS.md).

## База данных

Хранилище — Prisma. Схема на старте ещё меняется, поэтому **миграций нет**: не запускай `prisma migrate` и не создавай файлы в `prisma/migrations/`.

1. Правишь `prisma/schema.prisma`.
2. Применяешь схему: `npm run db:push`.
3. Обновляешь клиент: `npm run db:generate`.

Имена таблиц в базе — в нижнем регистре (`@@map`). Поля `createdAt` / `updatedAt` в модели не добавляем.

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).
