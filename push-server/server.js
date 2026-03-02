const express = require('express');
const app = express();
app.use(express.json()); // Обязательно для чтения данных от GitHub

// Этот маршрут ДОЛЖЕН быть в коде
app.post('/github-webhook', (req, res) => {
    console.log('Сигнал от GitHub получен!');
    
    // Здесь будет логика отправки пуша в Firebase
    
    res.status(200).send('OK'); // Отправляем Гитхабу статус 200, чтобы не было ошибки 502
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
