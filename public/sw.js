// PWA廃止に伴うキルスイッチ。
// 旧サイトのService Workerが訪問者のブラウザに残っているため、
// このファイルを削除せず「全キャッシュ削除 + 自己解除」する空のSWとして配信し続ける。
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      var keys = await caches.keys();
      await Promise.all(
        keys.map(function (key) {
          return caches.delete(key);
        })
      );
      await self.registration.unregister();
      var clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(function (client) {
        client.navigate(client.url);
      });
    })()
  );
});
