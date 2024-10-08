const PORT = process.env.PORT || 3000;

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Симуляция задержки запуска приложения
let isAppReady = false;
let isAppStarted = false;

setTimeout(() => {
    isAppStarted = true;
    console.log('Application started');
}, 15000); // 15 секунд для старта приложения

setTimeout(() => {
    isAppReady = true;
    console.log('Application is ready to accept traffic');
}, 20000); // 20 секунд для готовности

// Liveness Probe - проверка состояния "живо ли приложение"
app.get('/healthz', (req, res) => {
    res.status(200).send('I am alive');
});

// Readiness Probe - проверка готовности обрабатывать запросы
app.get('/ready', (req, res) => {
    if (isAppReady) {
        res.status(200).send('I am ready');
    } else {
        res.status(503).send('I am not ready');
    }
});

// Startup Probe - проверка успешного запуска приложения
app.get('/startup', (req, res) => {
    if (isAppStarted) {
        res.status(200).send('I have started');
    } else {
        res.status(503).send('I am still starting');
    }
});

// Маршрут для добавления элемента в базу данных
app.post('/api/items', async (req, res) => {
    try {
        const { name } = req.body;
        const [newItem] = await db('items').insert({ name }).returning('*');
        res.json(newItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Маршрут для получения всех элементов из базы данных
app.get('/api/items', async (req, res) => {
    try {
        // const items = await db('items').select('*');
        const items = []; // сделано для теста
        res.json(items);
    } catch (err) {
        console.error(err.message, err);
        res.status(500).send('Server Error');
    }
});

// Маршрут для получения одного элемента по id
app.get('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const item = await db('items').where({ id }).first();
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Маршрут для редактирования элемента по id
app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [updatedItem] = await db('items')
            .where({ id })
            .update({ name })
            .returning('*');

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(updatedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Маршрут для удаления элемента по id
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await db('items').where({ id }).del().returning('*');

        if (!deletedItem.length) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(deletedItem[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Экспортируем приложение
module.exports = app;

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
