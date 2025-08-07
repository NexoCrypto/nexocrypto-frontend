// API Service para conectar frontend React com backend Flask
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Métodos para Sinais
  async getSignals() {
    return this.request('/signals');
  }

  async parseSignal(message, group) {
    return this.request('/signals/parse', {
      method: 'POST',
      body: JSON.stringify({ message, group }),
    });
  }

  async generateSignal(symbol) {
    return this.request('/signals-generator/analyze/' + symbol);
  }

  async scanMarkets() {
    return this.request('/signals-generator/scan-markets');
  }

  async getActiveSignals() {
    return this.request('/signals-generator/active-signals');
  }

  // Métodos para Gems
  async findGems(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/gems/find?${queryParams}`);
  }

  async getTrendingGems() {
    return this.request('/gems/trending');
  }

  async classifyGems(projects) {
    return this.request('/gems-classifier/classify-batch', {
      method: 'POST',
      body: JSON.stringify({ projects }),
    });
  }

  async analyzeContract(contractAddress, network = 'ethereum') {
    return this.request('/gems/analyze-contract', {
      method: 'POST',
      body: JSON.stringify({ contract_address: contractAddress, network }),
    });
  }

  // Métodos para Airdrops
  async getActiveAirdrops() {
    return this.request('/gems/airdrops');
  }

  async getUpcomingLaunches() {
    return this.request('/gems/upcoming-launches');
  }

  // Métodos para Notícias
  async getPoliticalEvents() {
    return this.request('/political/events');
  }

  async getTrumpPowellAnalysis() {
    return this.request('/political/trump-powell');
  }

  async getMarketSentiment(symbol = 'BTC') {
    return this.request(`/news/sentiment/${symbol}`);
  }

  async getWhaleActivity() {
    return this.request('/news/whales');
  }

  async getNewsDashboard() {
    return this.request('/news/dashboard');
  }

  // Métodos para Copy Trading
  async getTopTraders() {
    return this.request('/copy-trading/traders');
  }

  async followTrader(traderId, settings) {
    return this.request(`/copy-trading/follow/${traderId}`, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async unfollowTrader(traderId) {
    return this.request(`/copy-trading/unfollow/${traderId}`, {
      method: 'DELETE',
    });
  }

  async getCopyTradingStats() {
    return this.request('/copy-trading/stats');
  }

  // Métodos para DCA Bots
  async getDCABots() {
    return this.request('/copy-trading/dca-bots');
  }

  async createDCABot(config) {
    return this.request('/copy-trading/dca-bots', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async updateDCABot(botId, config) {
    return this.request(`/copy-trading/dca-bots/${botId}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async deleteDCABot(botId) {
    return this.request(`/copy-trading/dca-bots/${botId}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Análise Técnica
  async getTechnicalAnalysis(symbol, timeframe = '4h') {
    return this.request(`/analysis/technical/${symbol}?timeframe=${timeframe}`);
  }

  async getAdvancedIndicators(symbol, indicators) {
    return this.request('/analysis/advanced-indicators', {
      method: 'POST',
      body: JSON.stringify({ symbol, indicators }),
    });
  }

  // Métodos para Gestão de Risco
  async calculatePosition(signal, accountBalance, riskPercentage = 1) {
    return this.request('/signals/calculate-position', {
      method: 'POST',
      body: JSON.stringify({ signal, account_balance: accountBalance, risk_percentage: riskPercentage }),
    });
  }

  async getLeverageRecommendation(signal, timeframe) {
    return this.request('/signals/leverage-recommendation', {
      method: 'POST',
      body: JSON.stringify({ signal, timeframe }),
    });
  }

  // Métodos para Telegram
  async configureTelegramGroups(groups) {
    return this.request('/telegram/configure-groups', {
      method: 'POST',
      body: JSON.stringify({ groups }),
    });
  }

  async getTelegramConfig() {
    return this.request('/telegram/config');
  }

  async testTelegramConnection() {
    return this.request('/telegram/test-connection');
  }
}

// Instância singleton do serviço de API
const apiService = new ApiService();

export default apiService;

