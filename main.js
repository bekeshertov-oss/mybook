import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging(app);

// Подписка и отправка токена на сервер
async function subscribeUser() {
  try {
    const token = await getToken(messaging, { vapidKey: 'ТВОЙ_PUBLIC_VAPID_KEY' });
    console.log('FCM токен получен:', token);

    // Отправляем токен на сервер, который автоматически управляет подпиской
    await fetch('/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
  } catch (err) {
    console.log('Ошибка получения токена:', err);
  }
}

// Запрос разрешения и запуск подписки
async function initPush() {
  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') subscribeUser();
  } else if (Notification.permission === 'granted') {
    subscribeUser();
  }
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(() => console.log('Service Worker зарегистрирован'))
    .catch(err => console.log('Ошибка регистрации SW:', err));
}

// Обработка пушей в foreground и установка красной точки
onMessage(messaging, payload => {
  console.log('Пуш в foreground:', payload);

  if (payload.notification) {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/icons/icon-192.png'
    });
  }

  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(1);
  }
});

// Запускаем пуши сразу после загрузки main.js
initPush();
