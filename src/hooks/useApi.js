import { useState, useEffect, useCallback } from 'react';

// Dados mock para fallback quando API não estiver disponível
const mockDashboardData = {
  activeSignals: 12,
  successRate: 87.3,
  totalROI: 234.7,
  gemsFound: 47,
  recentSignals: [
    { pair: 'BTCUSDT', direction: 'LONG', entry: '43,500', confidence: 87, status: 'Ativo' },
    { pair: 'ETHUSDT', direction: 'SHORT', entry: '3,650', confidence: 92, status: 'Pendente' },
    { pair: 'SOLUSDT', direction: 'LONG', entry: '98.50', confidence: 78, status: 'Ativo' }
  ]
};

const mockSignals = [
  {
    pair: 'BTCUSDT',
    direction: 'LONG',
    entry: 43500,
    targets: [44200, 45000, 46500],
    stopLoss: 42800,
    confidence: 87,
    leverage: 5.2,
    riskReward: 2.8,
    timeframe: '4h',
    status: 'active'
  },
  {
    pair: 'ETHUSDT',
    direction: 'SHORT',
    entry: 3650,
    targets: [3580, 3520, 3450],
    stopLoss: 3720,
    confidence: 92,
    leverage: 8.1,
    riskReward: 3.2,
    timeframe: '1h',
    status: 'pending'
  }
];

const mockGems = [
  {
    name: 'LayerZero',
    symbol: 'ZRO',
    rating: 5,
    score: 92.3,
    funding: '293M',
    category: 'Infrastructure',
    risk: 'low',
    potential: '+500%'
  },
  {
    name: 'Arbitrum',
    symbol: 'ARB',
    rating: 4,
    score: 85.7,
    funding: '120M',
    category: 'Layer 2',
    risk: 'medium',
    potential: '+200%'
  }
];

const mockNews = [
  {
    title: 'BlackRock compra $88M em ETH',
    impact: 'high',
    sentiment: 'bullish',
    time: '2h ago'
  },
  {
    title: 'Powell sinaliza possível corte de juros',
    impact: 'medium',
    sentiment: 'bullish',
    time: '4h ago'
  }
];

// Hook para dashboard geral
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockDashboardData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboardData, loading, error, refetch: fetchDashboard };
};

// Hook para sinais
export const useSignals = () => {
  const [signals, setSignals] = useState(mockSignals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSignals = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setSignals(mockSignals);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch signals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return { signals, loading, error, refetch: fetchSignals };
};

// Hook para gems
export const useGems = () => {
  const [gems, setGems] = useState(mockGems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGems = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setGems(mockGems);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch gems:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGems();
  }, [fetchGems]);

  return { gems, loading, error, refetch: fetchGems };
};

// Hook para notícias
export const useNews = () => {
  const [news, setNews] = useState(mockNews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setNews(mockNews);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, loading, error, refetch: fetchNews };
};

