var cacheName = 'Noise主页-v1.3.4';

self.addEventListener('install', function(event) {
  // 在安装事件中，打开缓存并添加静态资源到缓存中
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'https://jsd.onmicrosoft.cn/gh/rcy1314/noisework/assets/',
        'https://jsd.onmicrosoft.cn/gh/rcy1314/noisework/css/main.css',
        'https://jsd.onmicrosoft.cn/gh/rcy1314/noisework/js/main.js',
        // 添加您需要缓存的其他静态资源
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // 监听 fetch 事件，尝试从缓存中返回响应
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      // 如果请求未在缓存中找到，则发起网络请求
      return fetch(event.request).then(function(networkResponse) {
        // 将请求的响应添加到缓存中
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, networkResponse.clone());
        });

        return networkResponse;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  // 在激活事件中，清理旧版本的缓存
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          // 删除旧版本的缓存
          return name !== cacheName;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
});