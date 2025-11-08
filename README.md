# Блог

Сайт для ведения блога с серверной частью.

## Установка
Приложение рассчитано на запуск локальных серверов для клиента, сервера и БД.   
Запускаем конейнер с mongoDB:

```
docker run -d \
  --name mongo \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  -e MONGO_INITDB_DATABASE=testdb \
  -e MONGO_INITDB_ROOT_USERNAME=user \
  -e MONGO_INITDB_ROOT_PASSWORD=mongopass \
  mongo:latest

```
Запускаем сервер (порт 3001):
```
cd server
npm run dev
```
Запускаем клиент (порт 3000):
```
cd client
npm run dev
```



