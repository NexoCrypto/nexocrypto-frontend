import React, { useState, useEffect, useCallback } from 'react';

const PerformanceOptimizer = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    apiLatency: 0,
    memoryUsage: 0,
    cacheHits: 0,
    errors: 0
  });
  
  const [optimizations, setOptimizations] = useState({
    lazyLoading: true,
    caching: true,
    compression: true,
    prefetching: false
  });

  // Memoização para evitar re-renders desnecessários
  const memoizedMetrics = useCallback(() => {
    return {
      ...metrics,
      efficiency: Math.round((metrics.cacheHits / (metrics.cacheHits + metrics.errors + 1)) * 100)
    };
  }, [metrics]);

  // Lazy loading de componentes
  const LazyComponent = React.lazy(() => import('./LazyLoadedComponent'));

  // Cache de dados da API
  const apiCache = new Map();
  
  const cachedApiCall = useCallback(async (url, options = {}) => {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    if (apiCache.has(cacheKey)) {
      setMetrics(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
      return apiCache.get(cacheKey);
    }
    
    try {
      const startTime = performance.now();
      const response = await fetch(url, options);
      const endTime = performance.now();
      
      setMetrics(prev => ({ 
        ...prev, 
        apiLatency: Math.round(endTime - startTime) 
      }));
      
      const data = await response.json();
      apiCache.set(cacheKey, data);
      
      // Limpa cache após 5 minutos
      setTimeout(() => {
        apiCache.delete(cacheKey);
      }, 5 * 60 * 1000);
      
      return data;
    } catch (error) {
      setMetrics(prev => ({ ...prev, errors: prev.errors + 1 }));
      throw error;
    }
  }, []);

  // Monitoramento de performance
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          setMetrics(prev => ({
            ...prev,
            loadTime: Math.round(entry.loadEventEnd - entry.loadEventStart)
          }));
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    
    return () => observer.disconnect();
  }, []);

  // Monitoramento de memória
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        }));
      }
    };
    
    const interval = setInterval(checkMemory, 10000); // A cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  // Prefetch de recursos críticos
  useEffect(() => {
    if (optimizations.prefetching) {
      const criticalUrls = [
        '/api/signals',
        '/api/gems',
        '/api/news'
      ];
      
      criticalUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    }
  }, [optimizations.prefetching]);

  // Compressão de imagens
  const compressImage = useCallback((file, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Debounce para inputs
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    
    return debouncedValue;
  };

  // Virtual scrolling para listas grandes
  const VirtualList = ({ items, itemHeight, containerHeight }) => {
    const [scrollTop, setScrollTop] = useState(0);
    
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );
    
    const visibleItems = items.slice(startIndex, endIndex + 1);
    
    return (
      <div
        style={{ height: containerHeight, overflow: 'auto' }}
        onScroll={(e) => setScrollTop(e.target.scrollTop)}
      >
        <div style={{ height: items.length * itemHeight, position: 'relative' }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                position: 'absolute',
                top: (startIndex + index) * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Service Worker para cache offline
  useEffect(() => {
    if ('serviceWorker' in navigator && optimizations.caching) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registrado:', registration);
        })
        .catch((error) => {
          console.log('SW falhou:', error);
        });
    }
  }, [optimizations.caching]);

  const currentMetrics = memoizedMetrics();

  return {
    metrics: currentMetrics,
    optimizations,
    setOptimizations,
    cachedApiCall,
    compressImage,
    useDebounce,
    VirtualList
  };
};

// Hook personalizado para otimizações
export const usePerformanceOptimizer = () => {
  return PerformanceOptimizer();
};

// Componente de monitoramento visual
export const PerformanceMonitor = () => {
  const { metrics, optimizations, setOptimizations } = usePerformanceOptimizer();
  
  return (
    <div className="performance-monitor">
      <h3>🚀 Monitor de Performance</h3>
      
      <div className="metrics-grid">
        <div className="metric">
          <span>Tempo de Carregamento</span>
          <span className={metrics.loadTime > 3000 ? 'warning' : 'good'}>
            {metrics.loadTime}ms
          </span>
        </div>
        
        <div className="metric">
          <span>Latência API</span>
          <span className={metrics.apiLatency > 1000 ? 'warning' : 'good'}>
            {metrics.apiLatency}ms
          </span>
        </div>
        
        <div className="metric">
          <span>Uso de Memória</span>
          <span className={metrics.memoryUsage > 50 ? 'warning' : 'good'}>
            {metrics.memoryUsage}MB
          </span>
        </div>
        
        <div className="metric">
          <span>Eficiência</span>
          <span className={metrics.efficiency > 80 ? 'good' : 'warning'}>
            {metrics.efficiency}%
          </span>
        </div>
      </div>
      
      <div className="optimizations">
        <h4>Otimizações</h4>
        
        <label>
          <input
            type="checkbox"
            checked={optimizations.lazyLoading}
            onChange={(e) => setOptimizations(prev => ({
              ...prev,
              lazyLoading: e.target.checked
            }))}
          />
          Lazy Loading
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={optimizations.caching}
            onChange={(e) => setOptimizations(prev => ({
              ...prev,
              caching: e.target.checked
            }))}
          />
          Cache Inteligente
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={optimizations.compression}
            onChange={(e) => setOptimizations(prev => ({
              ...prev,
              compression: e.target.checked
            }))}
          />
          Compressão
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={optimizations.prefetching}
            onChange={(e) => setOptimizations(prev => ({
              ...prev,
              prefetching: e.target.checked
            }))}
          />
          Prefetch
        </label>
      </div>
      
      <style jsx>{`
        .performance-monitor {
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid #00ff00;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin: 16px 0;
        }
        
        .metric {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .good {
          color: #00ff00;
        }
        
        .warning {
          color: #ffaa00;
        }
        
        .optimizations {
          margin-top: 16px;
        }
        
        .optimizations label {
          display: block;
          margin: 8px 0;
          cursor: pointer;
        }
        
        .optimizations input {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default PerformanceOptimizer;

