# Скан — лендинг

Статический сайт: `index.html`, `app.js`, `config.js`, `vendor/`. Сборка не нужна — выложите папку на хостинг.

## Подключение Supabase (личный кабинет)

1. Создайте проект на supabase.com.
2. **SQL Editor** → вставьте содержимое `supabase/schema.sql` → Run.
3. **Project Settings → API Keys**: скопируйте адрес проекта и публичный ключ (publishable / anon) в `config.js`.
4. **Authentication → URL Configuration**: Site URL = адрес сайта, он же в Redirect URLs. Это единственное место, где адрес сайта задаётся вручную: сам сайт берёт его из адресной строки.

## Настройки безопасности в Supabase

- Ключ `secret` / `service_role` не должен попадать в `config.js` и вообще в браузер. Сайт такой ключ отвергает.
- **Authentication → Sign In / Providers → Email**: включите Confirm email, минимальную длину пароля 8 и проверку утёкших паролей (Leaked password protection).
- **Authentication → Rate Limits**: оставьте лимиты включёнными.
- **Authentication → Attack Protection**: включите CAPTCHA, когда пойдёт трафик.
- Для писем подключите свой SMTP: встроенный отправляет всего несколько писем в час.
- Каждой новой таблице сразу включайте RLS и пишите политики, как в `schema.sql`.

## Заголовки безопасности

На Vercel заголовки задаёт `vercel.json`, на Netlify и Cloudflare Pages — `_headers`. Оба файла лежат в корне и содержат одно и то же.
Файл `.vercelignore` не даёт попасть на сайт служебным файлам: `README.md`, `supabase/`, `_headers`.
Хэш в `script-src` относится к маленькому встроенному скрипту в `<head>` файла `index.html`: если измените этот скрипт, пересчитайте хэш.

## Ключ ИИ (Groq или другой)

Ключ ИИ — секретный. Его место — серверная функция (например, Supabase Edge Function), а не `config.js`.

## Анализ фото (Roboflow)

Сайт сжимает фото, отправляет его в серверную функцию `analyze` в Supabase, а она — в workflow Roboflow.
Ключ Roboflow хранится только в секретах Supabase. Фото нигде не сохраняется. Анализ доступен только вошедшим пользователям, не больше 30 в сутки на аккаунт.

1. **SQL Editor** → выполните `supabase/analysis.sql` (журнал для суточного лимита).
2. **Edge Functions** → Deploy a new function → Via Editor → имя `analyze` → вставьте `supabase/functions/analyze/index.ts` → Deploy.
3. В настройках функции выключите проверку JWT: функция сама проверяет пользователя.
4. **Edge Functions → Secrets**:
   - `ROBOFLOW_API_KEY` — ключ Roboflow;
   - `ROBOFLOW_WORKSPACE` — `tylerhanjs-workspace`;
   - `ROBOFLOW_WORKFLOW` — id workflow из примера кода Roboflow;
   - `DAILY_LIMIT` — необязательно, по умолчанию 30.

Цены в смете ориентировочные (таблица `PRICES` в `app.js`). Их можно переопределить в `config.js` полем `prices`.
Пока модель определяет только повреждённую деталь, действие выбирается типовое: стекло и фары — замена, кузовные детали — ремонт и покраска, колесо и неуверенные находки — осмотр мастером.
