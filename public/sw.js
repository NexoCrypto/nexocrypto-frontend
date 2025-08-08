// Service Worker para NexoCrypto
// Implementa cache inteligente e funcionalidade offline

const CACHE_NAME = 'nexocrypto-v1.0.0';
const STATIC_CACHE = 'nexocrypto-static-v1';
const API_CACHE = 'nexocrypto-api-v1';

// Recursos estáticos para cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// URLs da API para cache
const API_URLS = [
  '/api/health',
  '/api/signals',
  '/api/gems',
  '/api/news'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Instalando...');
  
  event.waitUntil(
    Promise.all([
      // Cache de recursos estáticos
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache inicial da API
      caches.open(API_CACHE).then((cache) => {
        return Promise.all(
          API_URLS.map(url => {
            return fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(() => {
                // Ignora erros na instalação
              });
          })
        );
      })
    ]).then(() => {
      console.log('SW: Cache inicial criado');
      return self.skipWaiting();
    })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('SW: Ativando...');
  
  event.waitUntil(
    // Limpa caches antigos
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== API_CACHE && 
              cacheName !== CACHE_NAME) {
            console.log('SW: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Ativado');
      return self.clients.claim();
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estratégia para recursos estáticos
  if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
  
  // Estratégia para API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }
  
  // Estratégia padrão
  event.respondWith(networkFirst(request, CACHE_NAME));
});

// Estratégia Cache First (para recursos estáticos)
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Atualiza cache em background
      updateCache(request, cache);
      return cachedResponse;
    }
    
    // Se não está no cache, busca na rede
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Erro em cacheFirst:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Estratégia Network First (para API)
async function networkFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    
    try {
      // Tenta buscar na rede primeiro
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Atualiza cache com resposta da rede
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
    } catch (networkError) {
      console.log('SW: Erro de rede, usando cache:', networkError);
    }
    
    // Se rede falhou, usa cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Se não tem cache, retorna erro
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Dados não disponíveis offline' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.log('SW: Erro em networkFirst:', error);
    return new Response('Erro interno', { status: 500 });
  }
}

// Atualiza cache em background
async function updateCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response);
    }
  } catch (error) {
    // Ignora erros de atualização em background
  }
}

// Limpa cache antigo periodicamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCache();
  }
});

async function cleanOldCache() {
  try {
    const cache = await caches.open(API_CACHE);
    const requests = await cache.keys();
    
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutos
    
    for (const request of requests) {
      const response = await cache.match(request);
      const dateHeader = response.headers.get('date');
      
      if (dateHeader) {
        const responseTime = new Date(dateHeader).getTime();
        if (now - responseTime > maxAge) {
          await cache.delete(request);
        }
      }
    }
    
    console.log('SW: Cache limpo');
  } catch (error) {
    console.log('SW: Erro ao limpar cache:', error);
  }
}

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sincroniza dados críticos
    const criticalEndpoints = ['/api/signals', '/api/health'];
    
    for (const endpoint of criticalEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const cache = await caches.open(API_CACHE);
          await cache.put(endpoint, response);
        }
      } catch (error) {
        console.log(`SW: Erro ao sincronizar ${endpoint}:`, error);
      }
    }
  } catch (error) {
    console.log('SW: Erro na sincronização:', error);
  }
}

// Notificações push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nova atualização disponível',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: data.tag || 'nexocrypto-notification',
      data: data.data || {},
      actions: [
        {
          action: 'open',
          title: 'Abrir',
          icon: '/icon-open.png'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/icon-close.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'NexoCrypto',
        options
      )
    );
  }
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('SW: Service Worker carregado');

