import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging(app);

// Проверяем разрешение на уведомления
if (Notification.permission === 'default') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Пуши разрешены');
      getFCMToken();
    } else {
      console.log('Пуши отклонены');
    }
  });
} else if (Notification.permission === 'granted') {
  getFCMToken();
} else {
  console.log('Пуши заблокированы пользователем');
}

// Функция получения FCM токена
function getFCMToken() {
  getToken(messaging, { vapidKey: 'ТВОЙ_PUBLIC_VAPID_KEY' })
    .then(token => {
      console.log('FCM токен:', token);
      // TODO: Отправить токен на сервер / подписать на topic "all"
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

  // Ставим красную точку
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(1);
  }
});
