self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag } = e.data;
    e.waitUntil(
      self.registration.showNotification(title || 'Notification', {
        body: body || '',
        tag: tag || undefined,
        silent: true,
        renotify: !!tag,
      })
    );
  }

  // support receiving a batch of notifications in one message
  if (e.data && e.data.type === 'SHOW_NOTIFICATION_BATCH' && Array.isArray(e.data.notifications)) {
    const notifs = e.data.notifications;
    e.waitUntil(
      Promise.all(notifs.map(n => {
        const t = n.title || 'Notification';
        const b = n.body || '';
        const tg = n.tag || undefined;
        return self.registration.showNotification(t, { body: b, tag: tg, silent: true, renotify: !!tg });
      }))
    );
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cls) => {
      if (cls.length > 0) {
        cls[0].focus();
      } else {
        clients.openWindow('./');
      }
    })
  );
});
