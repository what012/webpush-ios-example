self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, image } = e.data;
    const opts = {
      body: body || '',
      tag: tag || undefined,
      silent: true,
      renotify: !!tag,
    };
    if (image) opts.image = image;
    e.waitUntil(
      self.registration.showNotification(title || 'Notification', opts)
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
        clients.openWindow('/');
      }
    })
  );
});
