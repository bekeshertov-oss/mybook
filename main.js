import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging(app);

// Проверяем разрешение на уведомления
if (Notification.permission === 'default') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Пуши разрешены');
      subscribeUser();
    } else {
      console.log('Пуши отклонены');
    }
  });
} else if (Notification.permission === 'granted') {
  subscribeUser();
} else {
  console.log('Пуши заблокированы пользователем');
}

// Функция подписки пользователя на topic "all"
function subscribeUser() {
  getToken(messaging, { vapidKey: 'ТВОЙ_PUBLIC_VAPID_KEY' })
    .then(token => {
      console.log('FCM токен:', token);
      // 🔹 Отправляем токен на сервер
      // Например через fetch:
      fetch('/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      }).catch(err => console.log('Ошибка отправки токена на сервер:', err));
    })
    .catch(err => console.log('Ошибка получения токена:', err));
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(reg => console.log('SW зарегистрирован', reg))
    .catch(err => console.log('Ошибка регистрации SW:', err));
}

// Обработка пушей в foreground
onMessage(messaging, payload => {
  console.log('Получено сообщение в foreground:', payload);
  if (payload.notification) {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/icons/icon-192.png'
    });
  }

  // Ставим красную точку на иконке
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(1);
  }
});
