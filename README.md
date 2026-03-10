# ALMARE Site

Сайт отеля **ALMARE**.
Стек: React + TypeScript + Express + Vite.

---

## Стек

* React
* TypeScript
* Express
* Vite
* Tailwind CSS
* PostgreSQL / Drizzle ORM

---

## Установка

Установить зависимости:

```bash
npm install
```

---

## Запуск в режиме разработки

```bash
npm run dev
```

Сайт запустится в режиме разработки.

---

## Сборка проекта

```bash
npm run build
```

Эта команда собирает production-версию сайта.

---

## Запуск production

```bash
npm run start
```

После сборки сайт запускается в production-режиме.

---

## Проверка TypeScript

```bash
npm run check
```

Проверяет проект на ошибки TypeScript.

---

## Переменные окружения

Перед запуском проекта необходимо создать файл `.env`.

Пример переменных находится в файле `.env.example`.

Минимально необходимая переменная:

```
SESSION_SECRET
```

Остальные переменные (SMTP, Telegram, Database) можно подключить позже при переносе сайта на другой хостинг.

---

## Восстановление сайта на другом хосте

Если потребуется запустить сайт вне Replit:

1. Скачать проект из GitHub
2. Установить зависимости
3. Создать файл `.env`
4. Собрать проект
5. Запустить сервер

Команды:

```bash
git clone <repository-url>
cd almare-site
npm install
npm run build
npm run start
```

---

## Backup

Основная резервная копия кода хранится в GitHub.

После внесения изменений рекомендуется делать push в репозиторий GitHub, чтобы сохранить актуальную версию сайта.
