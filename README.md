# Simple Nest.js RabbitMQ Telegram Example

В проекте два отдельных Nest.js сервиса.

- `producer-service`: ручка `POST /notifications` принимает `message`, создаёт `eventId` и кладёт JSON в RabbitMQ queue.
- `consumer-service`: слушает эту RabbitMQ queue, отправляет `message` в Telegram через Bot API и делает `ack`; при ошибке делает `nack` с повторной доставкой.

## Запуск

```bash
cp .env.example .env
docker compose --env-file .env up --build
```

Swagger:

- Producer: http://localhost:3000/docs
- Consumer: http://localhost:3001/docs
- RabbitMQ UI: http://localhost:15672, `guest` / `guest`

Пример запроса:

```bash
curl -X POST http://localhost:3000/notifications \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hello Telegram"}'
```

Если нужно отправить в конкретный чат:

```bash
curl -X POST http://localhost:3000/notifications \
  -H 'Content-Type: application/json' \
  -d '{"message":"Hello Telegram","chatId":"123456789"}'
```

## Переменные

- `RABBITMQ_URL`: по умолчанию `amqp://guest:guest@localhost:5672`
- `RABBITMQ_QUEUE`: по умолчанию `telegram.notifications`
- `TELEGRAM_BOT_TOKEN`: токен бота

## Проверки

```bash
cd producer-service
npm test
npm run test:e2e
npm run build
```

```bash
cd consumer-service
npm test
npm run test:e2e
npm run build
```
