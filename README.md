# Nest.js RabbitMQ Telegram Microservices

В проекте два отдельных Nest.js сервиса с clean architecture границами.

- `producer-service`: `POST /notifications` принимает `message`, use case создаёт доменное событие с `eventId`, RabbitMQ adapter публикует JSON в queue.
- `consumer-service`: RabbitMQ adapter читает queue, валидирует доменное событие, use case проверяет идемпотентность и отправляет уведомление через Telegram adapter.

## Архитектура

Слои:

- `domain`: доменные события и их валидация.
- `application`: use cases и порты интерфейсов.
- `infrastructure`: RabbitMQ, Telegram Bot API, idempotency store.
- `presentation`: HTTP controllers и DTO.

Основной поток:

```text
Producer HTTP -> PublishNotificationUseCase -> EventPublisher port -> RabbitMQ
RabbitMQ -> RabbitmqConsumer -> ProcessNotificationUseCase -> TelegramNotifier port -> Telegram API
```

RabbitMQ:

- Queue: `telegram.notifications`
- Сообщения persistent.
- Consumer использует `prefetch(1)`.
- `ack` выполняется только после успешного use case.
- При ошибке выполняется `nack` с повторной доставкой.
- Идемпотентность реализована через `eventId` в `InMemoryIdempotencyStore`. Для production этот adapter можно заменить на Redis/PostgreSQL без изменения use case.

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
