# Указываем базовый образ
FROM node:17-alpine

# можем передавать аргументы при билде контейнера
ARG PORT

# и использовать их при выполнении текущих команд
ENV PORT=$PORT

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и lock файл и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем оставшиеся файлы приложения
COPY app.js ./

# Открываем порт
EXPOSE ${PORT}

# Указываем команду для запуска
CMD ["node", "app.js"]
