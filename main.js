import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging(app);

Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    getToken(messaging, { vapidKey: 'ТВОЙ_PUBLIC_VAPID_KEY' })
      .then(token => {
        console.log('FCM токен:', token);
        // Сохраняем токен на сервере, чтобы слать пуши
      })
      .catch(err => console.log('Ошибка получения токена:', err));
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(reg => console.log('SW зарегистрирован', reg))
    .catch(err => console.log('Ошибка регистрации SW:', err));
}
