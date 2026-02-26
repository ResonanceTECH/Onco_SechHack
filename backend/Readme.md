## Backend (FastAPI) – Case Opening API

Backend-сервис для работы с кейсами и авторизацией врачей. Стек: **Python + FastAPI + PostgreSQL + SQLAlchemy (async) + JWT**.

### Требования

- **Python**: 3.11+
- **PostgreSQL**: 14+

### Установка

```powershell
cd D:\Code\Onco_SechHack\backend

# (опционально) создаём виртуальное окружение
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# ставим зависимости
pip install -r requirements.txt
```

На Linux/macOS активация venv:

```bash
source .venv/bin/activate
```

### Конфигурация (.env)

Файл `.env` должен лежать в корне `backend` (рядом с `requirements.txt`). Настройки читаются через `src/config.py`.

Минимальный пример:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASS=your_password
DB_NAME=your_db

JWT_SECRET_KEY=your-long-secret
JWT_ALGORITHM=HS256

CSRF_SECRET_KEY=your-csrf-secret
CSRF_TOKEN_EXPIRY=3600

RATE_LIMIT_LOGIN_ATTEMPTS=10
RATE_LIMIT_LOGIN_WINDOW=300
RATE_LIMIT_BLOCK_DURATION=900
```

Обязательные переменные:

- **DB_HOST / DB_PORT / DB_USER / DB_PASS / DB_NAME** – подключение к PostgreSQL.
- **JWT_SECRET_KEY / JWT_ALGORITHM** – подпись JWT-токенов.
- **CSRF_SECRET_KEY** – секрет для CSRF-защиты.

### База данных

Под капотом используется **PostgreSQL + asyncpg + SQLAlchemy 2.0**.

1. Создай базу данных вручную (через `psql`, PgAdmin и т.п.):

```sql
CREATE DATABASE your_db;
```

2. Пропиши параметры подключения в `.env`.

> Если дальше появятся миграции Alembic, сюда можно будет добавить команду вида `alembic upgrade head`.

### Запуск dev-сервера

Из корня `backend`:

```powershell
cd D:\Code\Onco_SechHack\backend
uvicorn src.main:app --host 127.0.0.1 --port 8001 --reload
```

Документация:

- Swagger UI: `http://127.0.0.1:8001/docs`
- ReDoc: `http://127.0.0.1:8001/redoc`

Альтернатива (через `python` напрямую, если не хочешь ставить uvicorn как CLI):

```powershell
cd D:\Code\Onco_SechHack\backend\src
python main.py
```

### Структура

- `src/main.py` – создание `FastAPI`-приложения, CORS, CSRF, подключение роутеров.
- `src/config.py` – `Settings` (pydantic-settings): чтение `.env`, сборка `DB_URL`/`ASYNC_DB_URL`.
- `src/database.py` – создание `AsyncEngine` и `async_sessionmaker`.
- `src/models/` – SQLAlchemy-модели.
- `src/repositories/` – работа с БД.
- `src/services/` – бизнес-логика.
- `src/api/auth.py` – эндпоинты аутентификации / авторизации.
- `src/api/cases.py` – эндпоинты работы с кейсами.
- `src/utils/db_manager.py` – `DBManager` для удобной работы с сессиями БД.



