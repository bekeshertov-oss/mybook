const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Инициализация Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'rednek-7eb9b',
    clientEmail: 'firebase-adminsdk-xxxxx@rednek-7eb9b.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nВАШ_КЛЮЧ\n-----END PRIVATE KEY-----\n'
  })
});

// Endpoint для подписки токена на topic "all"
app.post('/subscribe', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).send('Нет токена');

    await admin.messaging().subscribeToTopic(token, 'all');
    res.send('Успешно подписан на topic "all"');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка');
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
