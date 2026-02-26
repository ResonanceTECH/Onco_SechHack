## Frontend – ОнкоПротокол+

Фронтенд-приложение для онкологов и врачей: лендинг продукта и рабочее место врача с чатами, проверкой кейсов, генерацией отчётов и историей консультаций. Построено на **React 18 + TypeScript + Vite + Tailwind CSS**, интегрировано с backend API (FastAPI).

### Содержание

- **Технологии**
- **Требования**
- **Установка и запуск**
- **Структура проекта**
- **Архитектура**
- **Дизайн-система**
- **Компоненты**
- **Страницы**
- **API интеграция**

### Технологии

- **Основные зависимости**
  - **React 18.3** – UI библиотека.
  - **TypeScript 5.7** – статическая типизация.
  - **Vite 6** – сборщик и dev-сервер.
  - **react-router-dom 7** – клиентский роутинг.
  - **zustand 5** – лёгкий стейт-менеджер (auth, чаты, layout).
  - **react-hook-form** + **zod** – формы и валидация.
  - **@radix-ui/react-dialog** – диалоги и модалки.
  - **lucide-react** – иконки.
  - **framer-motion** – анимации.
  - **tailwindcss** – utility-first стили.

- **Dev-зависимости**
  - **@vitejs/plugin-react** – интеграция React с Vite.
  - **typescript** – компилятор TS.
  - **postcss / autoprefixer / tailwindcss** – пайплайн стилей.

### Требования

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (или совместимый pnpm/yarn)
- Запущенный **backend API** (по умолчанию `http://127.0.0.1:8001`).

Переменные окружения фронта задаются в `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8001
VITE_USE_REAL_API=true
```

### Установка и запуск

**Установка зависимостей**

```bash
cd frontend
npm install
```

По умолчанию приложение будет доступно по адресу, который напишет Vite (обычно `http://localhost:5173`).


### Структура проекта

```
frontend/
├── public/                 # Статические файлы
├── src/                    # Исходный код
│   ├── api/                # HTTP-клиент и моки
│   │   ├── http.ts         # Обёртка над fetch, CSRF, baseURL
│   │   └── mock/           # Моки auth/chats/guidelines/reports
│   ├── components/         # React-компоненты
│   │   ├── layout/         # Layout'ы (Landing, Auth, Doctor)
│   │   ├── chat/           # Компоненты чата врача
│   │   ├── report/         # Компоненты отчётов и отклонений
│   │   ├── sections/       # Блоки лендинга (Hero, Roadmap, и т.п.)
│   │   ├── wizard/         # Мастер-форма по шагам (кейсы)
│   │   ├── platform-ui/    # Общие UI-компоненты (Accordion, Table, Toast, Modal)
│   │   └── ui/             # Базовые элементы (Button, Card, Container...)
│   ├── pages/              # Страницы
│   │   ├── auth/           # Login / Register
│   │   └── doctor/         # Рабочее место врача (chats, history, report...)
│   ├── routes/             # Маршруты и защищённые роуты
│   ├── stores/             # Zustand-сторы (auth, chat, layout)
│   ├── types/              # Общие типы (auth, chat, case, report)
│   ├── constants/          # Константы навигации, конфиг
│   ├── utils/              # Утилиты (например, detectPII)
│   ├── App.tsx             # Корневой компонент с роутингом
│   └── main.tsx            # Точка входа React
├── index.html              # HTML-шаблон
├── package.json            # Зависимости и скрипты
├── tsconfig*.json          # Конфигурация TypeScript
├── vite.config.ts          # Конфиг Vite
├── tailwind.config.js      # Конфиг Tailwind
└── Readme.md               # Описание
```

### Архитектура

- **Общая архитектура**
  - React-приложение с разделением на:
    - **pages** – страницы верхнего уровня, привязанные к маршрутам.
    - **components** – переиспользуемые view-компоненты и layout'ы.
    - **stores** – глобальное состояние через Zustand.
    - **api** – HTTP-клиент и прослойка к backend/mocks.
    - **types** – типы доменных сущностей (пользователь, чат, кейс, отчёт).

- **Поток данных**
  - User Action → Component → **store/api** → обновление состояния → перерисовка UI.
  - Состояние чатов и auth кэшируется в `localStorage` (через `zustand/middleware` и собственные утилиты).

- **Роутинг** (`App.tsx`)
  - `/` – лендинг (`LandingLayout` + `LandingPage`).
  - `/roadmap`, `/comparison`, `/team` – маркетинговые страницы.
  - `/auth/login`, `/auth/register` – аутентификация (внутри `AuthLayout`).
  - `/doctor/*` – рабочее место врача (под `DoctorChatLayout` + `ProtectedRoute`):
    - `/doctor/chats` – чаты и мастер-кейс.
    - `/doctor/history` – история кейсов.
    - `/doctor/guidelines` – руководства/протоколы.
    - `/doctor/notifications` – уведомления.
    - `/doctor/profile` – профиль врача.
    - `/doctor/help` – помощь.
    - `/doctor/check/:id/report` – страница отчёта по проверке.

### Дизайн-система

- **Базовый слой**
  - **Tailwind CSS** – utility-first слой: spacing, цвета, типографика, layout.
  - Глобальные стили и базовые токены определяются в `index.css` и `tailwind.config.js`.

- **Базовые UI-атомы** (`src/components/ui`)
  - **`Button`** – единый компонент кнопки (варианты, размеры, состояния, иконки).
  - **`Card`** – карточки для блоков отчёта/истории.
  - **`Badge`** – бэйджи статусов/меток.
  - **`Container` / `Section`** – обёртки для секций лендинга и внутренних страниц.
  - **`FadeIn`** – анимации появления для ключевых блоков.

  **Примеры использования**

  - **Button**

    ```tsx
    import { Button } from '../components/ui/Button';

    export function ExampleButtons() {
      return (
        <div className="flex gap-3">
          <Button>Основная кнопка</Button>
          <Button variant="secondary">Вторичная</Button>
          <Button variant="outline" size="sm">
            Малая
          </Button>
          <Button variant="ghost" disabled>
            Отключена
          </Button>
        </div>
      );
    }
    ```

  - **Card + Badge**

    ```tsx
    import { Card } from '../components/ui/Card';
    import { Badge } from '../components/ui/Badge';

    export function CaseSummaryCard() {
      return (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Кейс #12345</h3>
            <Badge variant="success">Соответствует КР</Badge>
          </div>
          <p className="text-sm text-slate-600">
            Пациент, 54 года, рак молочной железы. Линия терапии: 1-я.
          </p>
        </Card>
      );
    }
    ```

  - **Container / Section**

    ```tsx
    import { Container } from '../components/ui/Container';
    import { Section } from '../components/ui/Section';

    export function LandingBlock() {
      return (
        <Section id="hero">
          <Container className="py-16 space-y-4">
            <h1 className="text-3xl font-bold">
              ОнкоПротокол+
            </h1>
            <p className="text-slate-600 max-w-xl">
              Проверка онкологических протоколов на соответствие
              клиническим рекомендациям в один клик.
            </p>
          </Container>
        </Section>
      );
    }
    ```

  - **FadeIn**

    ```tsx
    import { FadeIn } from '../components/ui/FadeIn';

    export function AnimatedBlock() {
      return (
        <FadeIn delay={0.1}>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            Блок, который плавно появляется при скролле.
          </div>
        </FadeIn>
      );
    }
    ```

- **Платформенный слой** (`src/components/platform-ui`)
  - **`Accordion`** – раскрывающиеся списки (FAQ, блоки отчёта).
  - **`Modal`** (Radix Dialog под капотом) – диалоговые окна и подтверждения.
  - **`Toast`** – всплывающие уведомления (успех/ошибка).
  - **`Stepper`** – индикатор прогресса мастера кейса.
  - **`EmptyState`** – шаблоны пустых состояний (нет данных/чатов/кейсов).
  - **`Table`** – таблицы для списков (история, протоколы и т.п.).

- **Принципы использования**
  - **Без "голого" Tailwind в бизнес-компонентах**, по возможности: сначала заворачиваем паттерн в `ui/*` или `platform-ui/*`.
  - **Повторяющиеся шаблоны (карточки, модалки, empty state)** должны идти через компоненты дизайн-системы, а не копипасту.
  - **State/логика** живут в pages/stores, **дизайн-компоненты** остаются глупыми и переиспользуемыми.

### Компоненты

- **Layout-компоненты**
  - **`LandingLayout`** – шапка/футер/контент для публичных страниц.
  - **`AuthLayout`** – макет страниц логина/регистрации.
  - **`DoctorChatLayout`** – основной layout врача: левый сайдбар чатов, top-bar, правая панель отчёта.
  - **`SidebarChats`** – список чатов, группировка, создание/удаление/переименование.
  - **`ReportPanelSidebar`** – правая панель с отчётом по кейсу.
  - **`TopBar`** – верхняя панель с навигацией и пользовательским меню.

- **Chat / Wizard / Report**
  - **`ChatMessage`, `UserMessage`, `AssistantMessage`, `Composer`** – компоненты чата, ввод текста, отображение сообщений.
  - **`wizard/Step0…Step5`** – пошаговый мастер заполнения кейса (нозология, диагноз, анализы, назначения, источники, подтверждение).
  - **`report/*`** – карточки отчёта, прогресс, список отклонений и форма коррекции.

- **UI / Platform-UI**
  - **`ui/Button`, `Card`, `Badge`, `Container`, `Section`, `FadeIn`** – базовые переиспользуемые блоки.
  - **`platform-ui/Accordion`, `Modal`, `Toast`, `Stepper`, `EmptyState`, `Table`** – компоненты дизайн-системы для сложных экранов.

### Страницы

- **Landing**
  - `LandingPage` + секции (`HeroSection`, `SolutionSection`, `AdvantagesSection`, `ProtocolsSlider`, `SecuritySection`, `RoadmapSection`, `FaqSection`, `CtaSection`, `CtaBannerSection`, `SolutionScreensSlider`) – лендинг продукта.
  - `RoadmapPage`, `ComparisonPage`, `TeamPage` – дополнительные маркетинговые страницы.

- **Auth**
  - `LoginPage` – форма входа врача (email + пароль, валидация через `react-hook-form` + `zod`).
  - `RegisterPage` – регистрация (может дополнительно использоваться для демо/онбординга).

- **Doctor**
  - `ChatsPage` – главный рабочий экран чатов и мастера кейса.
  - `HistoryPage` – история кейсов/проверок.
  - `GuidelinesPage` – список протоколов/гайдлайнов (частично на моках).
  - `NotificationsPage` – уведомления врача.
  - `ProfilePage` – профиль и настройки врача.
  - `HelpPage` – помощь и справка.
  - `ReportPage` – подробный отчёт по проверке кейса (`/doctor/check/:id/report`).

