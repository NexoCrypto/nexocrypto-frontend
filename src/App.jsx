import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [signals, setSignals] = useState([])
  const [gems, setGems] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)

  // Dados atualizados com preços reais de 07/08/2025
  const mockSignals = [
    {
      id: 1,
      pair: "BTCUSDT",
      direction: "LONG",
      entry: 115000,
      currentPrice: 115045,
      targets: [118500, 122000, 128000],
      stopLoss: 110500,
      confidence: 89,
      timeframe: "1D",
      status: "active",
      created: "07/08/2025 - 22:30",
      analysis: "BTC testando resistência em $115K com volume institucional forte. ETFs com fluxos positivos."
    },
    {
      id: 2,
      pair: "ETHUSDT", 
      direction: "LONG",
      entry: 3675,
      currentPrice: 3674,
      targets: [3850, 4100, 4400],
      stopLoss: 3450,
      confidence: 82,
      timeframe: "4H",
      status: "active",
      created: "07/08/2025 - 22:15",
      analysis: "ETH rompeu $3700 com força. Empresas públicas acumulando ETH massivamente."
    },
    {
      id: 3,
      pair: "SOLUSDT",
      direction: "LONG", 
      entry: 168,
      currentPrice: 168.32,
      targets: [180, 195, 220],
      stopLoss: 155,
      confidence: 85,
      timeframe: "4H",
      status: "active",
      created: "07/08/2025 - 21:45",
      analysis: "SOL mantém força com +4% hoje. Ecosystem em expansão contínua."
    },
    {
      id: 4,
      pair: "ADAUSDT",
      direction: "LONG",
      entry: 0.42,
      currentPrice: 0.418,
      targets: [0.48, 0.55, 0.65],
      stopLoss: 0.38,
      confidence: 76,
      timeframe: "1D",
      status: "active",
      created: "07/08/2025 - 21:30",
      analysis: "ADA em acumulação. Smart contracts e estrutura resiliente atraindo investidores."
    },
    {
      id: 5,
      pair: "GALAUSDT",
      direction: "LONG",
      entry: 0.026,
      currentPrice: 0.0258,
      targets: [0.035, 0.045, 0.065],
      stopLoss: 0.022,
      confidence: 78,
      timeframe: "4H",
      status: "active",
      created: "07/08/2025 - 20:45",
      analysis: "GALA gaming sector em alta. Partnerships fortes e baixo market cap."
    }
  ]

  const mockGems = [
    {
      id: 1,
      name: "Bitcoin Hyper",
      symbol: "HYPER",
      price: 0.003,
      marketCap: "15M",
      stars: 5,
      potential: "1000%+",
      category: "Layer-2",
      description: "Layer 2 para Bitcoin em presale. Projeto alinhado com crescimento do ecossistema BTC."
    },
    {
      id: 2,
      name: "Biconomy",
      symbol: "BICO", 
      price: 0.28,
      marketCap: "180M",
      stars: 4,
      potential: "500-800%",
      category: "Web3",
      description: "Infraestrutura Web3 com backing da Coinbase. Target $5+ segundo análises."
    },
    {
      id: 3,
      name: "Space ID",
      symbol: "ID",
      price: 0.45,
      marketCap: "320M", 
      stars: 4,
      potential: "300-600%",
      category: "Identity",
      description: "Plataforma de identidade descentralizada com aplicações no mundo real."
    },
    {
      id: 4,
      name: "GALA Games",
      symbol: "GALA",
      price: 0.026,
      marketCap: "800M",
      stars: 4,
      potential: "200-400%",
      category: "Gaming",
      description: "Líder no setor gaming com partnerships sólidas e crescimento do GameFi."
    },
    {
      id: 5,
      name: "Supra",
      symbol: "SUPRA",
      price: 0.47,
      marketCap: "450M",
      stars: 4,
      potential: "150-300%",
      category: "Oracle",
      description: "Rede Oracle inovadora com integração DeFi crescente e baixo supply circulante."
    },
    {
      id: 6,
      name: "Aergo",
      symbol: "AERGO",
      price: 0.08,
      marketCap: "50M",
      stars: 3,
      potential: "250-500%",
      category: "Enterprise",
      description: "Blockchain empresarial com backing coreano (Samsung). Fase de acumulação."
    }
  ]
  const mockNews = [
    {
      id: 1,
      title: "Mercado crypto estabiliza em $3.7T enquanto traders rotacionam para micro-caps",
      prediction: "Consolidação em $3.6-3.8T, foco em altcoins pequenas",
      source: "market_analysis",
      impact: "NEUTRAL",
      severity: 6.5,
      timestamp: "07/08/2025 - 22:00"
    },
    {
      id: 2,
      title: "SEC aprova resgates in-kind para ETFs de Bitcoin e Ethereum",
      prediction: "+3% a +8% em 24-48h para BTC/ETH",
      source: "regulatory",
      impact: "BULLISH", 
      severity: 8.5,
      timestamp: "06/08/2025 - 23:30"
    },
    {
      id: 3,
      title: "Empresas públicas pequenas acumulam Ethereum em nova corrida do ouro crypto",
      prediction: "+5% a +12% para ETH em 1-3 dias",
      source: "institutional_buying",
      impact: "BULLISH",
      severity: 7.8,
      timestamp: "06/08/2025 - 21:15"
    },
    {
      id: 4,
      title: "Trump assina ordem executiva facilitando ativos privados em 401(k)s",
      prediction: "+2% a +6% mercado geral em 2-5 dias",
      source: "political",
      impact: "BULLISH",
      severity: 7.2,
      timestamp: "07/08/2025 - 21:45"
    },
    {
      id: 5,
      title: "Bitcoin ETFs registram $812M em saídas lideradas por Fidelity e ARK",
      prediction: "Pressão vendedora temporária, -2% a -5%",
      source: "etf_flows",
      impact: "BEARISH",
      severity: 6.8,
      timestamp: "06/08/2025 - 19:30"
    },
    {
      id: 6,
      title: "PlanB atualiza previsão: Bitcoin fecha julho em novo ATH mensal",
      prediction: "Continuação da tendência, +8% a +15% próximas semanas",
      source: "technical_analysis",
      impact: "BULLISH",
      severity: 8.2,
      timestamp: "06/08/2025 - 17:20"
    }
  ]

  useEffect(() => {
    setSignals(mockSignals)
    setGems(mockGems)
    setNews(mockNews)
  }, [])

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Sinais Ativos</h3>
          <p className="text-3xl font-bold text-green-400">{signals.length}</p>
          <p className="text-sm text-gray-300">+2 nas últimas 24h</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Taxa de Sucesso</h3>
          <p className="text-3xl font-bold text-blue-400">89%</p>
          <p className="text-sm text-gray-300">Últimos 30 dias</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">ROI Médio</h3>
          <p className="text-3xl font-bold text-purple-400">+28.3%</p>
          <p className="text-sm text-gray-300">Por trade</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Gems Encontradas</h3>
          <p className="text-3xl font-bold text-yellow-400">{gems.length}</p>
          <p className="text-sm text-gray-300">Esta semana</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Sistema Funcionando</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg">
            <div>
              <h3 className="font-semibold text-white">✅ Backend Flask</h3>
              <p className="text-gray-300">Servidor rodando na porta 5000</p>
            </div>
            <span className="text-green-400 font-bold">ONLINE</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg">
            <div>
              <h3 className="font-semibold text-white">✅ Frontend React</h3>
              <p className="text-gray-300">Interface rodando na porta 8080</p>
            </div>
            <span className="text-green-400 font-bold">ONLINE</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg">
            <div>
              <h3 className="font-semibold text-white">🚀 Funcionalidades</h3>
              <p className="text-gray-300">Sinais, Gems, Notícias, Cursos, Auto Trading, Copy Trading</p>
            </div>
            <span className="text-blue-400 font-bold">PRONTO</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSignals = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Sinais de Trading</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {signals.map((signal) => (
          <div key={signal.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{signal.pair}</h3>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  signal.direction === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {signal.direction}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Confiança</div>
                <div className="text-lg font-bold text-blue-400">{signal.confidence}%</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Entrada</div>
                <div className="text-white font-medium">${signal.entry.toLocaleString()}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Preço Atual</div>
                <div className={`font-medium ${
                  signal.currentPrice >= signal.entry ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${signal.currentPrice.toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Targets</div>
                <div className="flex space-x-2">
                  {signal.targets.map((target, i) => (
                    <span key={i} className="text-green-400 text-sm">
                      TP{i+1}: ${target.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Stop Loss</div>
                <div className="text-red-400 font-medium">${signal.stopLoss.toLocaleString()}</div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Timeframe: {signal.timeframe}</span>
                <span className="text-gray-400">{signal.created}</span>
              </div>
              
              {signal.analysis && (
                <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-xs text-blue-400 mb-1">Análise:</div>
                  <div className="text-sm text-gray-300">{signal.analysis}</div>
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="text-xs text-gray-400 mb-2">Compartilhar:</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => shareSignal(signal, 'telegram')}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded text-xs font-medium transition-colors"
                  >
                    📱 Telegram
                  </button>
                  <button
                    onClick={() => shareSignal(signal, 'whatsapp')}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded text-xs font-medium transition-colors"
                  >
                    💬 WhatsApp
                  </button>
                  <button
                    onClick={() => shareSignal(signal, 'email')}
                    className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-2 rounded text-xs font-medium transition-colors"
                  >
                    ✉️ Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderGems = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gems Descobertas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {gems.map((gem) => (
          <div key={gem.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{gem.name}</h3>
                <div className="text-gray-400">{gem.symbol}</div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < gem.stars ? 'text-yellow-400' : 'text-gray-600'}`}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Preço</div>
                  <div className="text-white font-medium">${gem.price}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Market Cap</div>
                  <div className="text-white font-medium">{gem.marketCap}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Potencial</div>
                <div className="text-green-400 font-bold">{gem.potential}</div>
              </div>
              
              <div>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                  {gem.category}
                </span>
              </div>
              
              <div className="text-sm text-gray-300">{gem.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNews = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Monitoramento de Notícias</h2>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  item.impact === 'BULLISH' ? 'bg-green-500/20 text-green-400' : 
                  item.impact === 'BEARISH' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {item.impact}
                </span>
                <span className="text-yellow-400 font-bold">{item.severity}/10</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">
                <span className="font-medium">Predição:</span> {item.prediction}
              </p>
              <p className="text-gray-400 text-xs">
                <span className="font-medium">Fonte:</span> {item.source}
              </p>
              <p className="text-gray-400 text-xs">
                {item.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Função para compartilhar sinal
  const shareSignal = (signal, platform) => {
    const signalText = `🚀 SINAL CRYPTO - ${signal.pair}
    
📈 Direção: ${signal.direction}
💰 Entrada: $${signal.entry.toLocaleString()}
💰 Atual: $${signal.currentPrice.toLocaleString()}
🎯 Targets: ${signal.targets.map((t, i) => `TP${i+1}: $${t.toLocaleString()}`).join(' | ')}
🛑 Stop Loss: $${signal.stopLoss.toLocaleString()}
📊 Confiança: ${signal.confidence}%
⏰ ${signal.created}

📊 NexoCrypto`

    const encodedText = encodeURIComponent(signalText)
    
    switch(platform) {
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodedText}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}`, '_blank')
        break
      case 'email':
        window.open(`mailto:?subject=Sinal Crypto - ${signal.pair}&body=${encodedText}`, '_blank')
        break
    }
  }

  const renderAutoTrading = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Auto Trading - Integração Telegram + ByBit</h2>
      
      {/* Status e Configurações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Painel de Controle */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">🎛️ Painel de Controle</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status do Bot</label>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">ATIVO</span>
                <button className="ml-auto bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-sm">
                  Pausar
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Valor Máximo por Operação</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  defaultValue="100"
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white w-24"
                />
                <span className="text-gray-300">USDT</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">% do Saldo por Trade</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  defaultValue="2"
                  className="flex-1"
                />
                <span className="text-white font-medium w-8">2%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Análise Automática</label>
              <div className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Validar sinais antes de executar</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Grupos Conectados */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">📱 Grupos Telegram</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg">
              <div>
                <div className="font-medium text-white">Binance Killers</div>
                <div className="text-sm text-gray-300">Conectado • 15 sinais hoje</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg">
              <div>
                <div className="font-medium text-white">ByBit Pro</div>
                <div className="text-sm text-gray-300">Conectado • 8 sinais hoje</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-500/20 rounded-lg">
              <div>
                <div className="font-medium text-white">Raven Pro</div>
                <div className="text-sm text-gray-300">Aguardando configuração</div>
              </div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
            
            <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 py-2 rounded font-medium">
              + Adicionar Grupo
            </button>
          </div>
        </div>
      </div>
      
      {/* Estatísticas e Histórico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Estatísticas */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">📊 Estatísticas Hoje</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Sinais Recebidos:</span>
              <span className="text-white font-medium">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Executados:</span>
              <span className="text-green-400 font-medium">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Rejeitados:</span>
              <span className="text-red-400 font-medium">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Taxa de Sucesso:</span>
              <span className="text-blue-400 font-medium">83%</span>
            </div>
          </div>
        </div>
        
        {/* Saldo ByBit */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">💰 Saldo ByBit</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Saldo Total:</span>
              <span className="text-white font-medium">2,450 USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Em Posições:</span>
              <span className="text-yellow-400 font-medium">340 USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Disponível:</span>
              <span className="text-green-400 font-medium">2,110 USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">P&L Hoje:</span>
              <span className="text-green-400 font-medium">+45.30 USDT</span>
            </div>
          </div>
        </div>
        
        {/* Análise IA */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">🧠 Análise IA</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Sinais Analisados:</span>
              <span className="text-white font-medium">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Aprovados:</span>
              <span className="text-green-400 font-medium">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Rejeitados:</span>
              <span className="text-red-400 font-medium">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Precisão IA:</span>
              <span className="text-blue-400 font-medium">91%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Últimas Operações */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📈 Últimas Operações</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div>
                <div className="font-medium text-white">BTCUSDT LONG</div>
                <div className="text-sm text-gray-300">Binance Killers • 13:45</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-medium">+2.3%</div>
              <div className="text-sm text-gray-300">50 USDT</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div>
                <div className="font-medium text-white">ETHUSDT SHORT</div>
                <div className="text-sm text-gray-300">ByBit Pro • 12:30</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-medium">-1.1%</div>
              <div className="text-sm text-gray-300">75 USDT</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div>
                <div className="font-medium text-white">SOLUSDT LONG</div>
                <div className="text-sm text-gray-300">Binance Killers • 11:15</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-medium">Em andamento</div>
              <div className="text-sm text-gray-300">100 USDT</div>
            </div>
          </div>
        </div>
        
        <button className="w-full mt-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 py-2 rounded font-medium">
          Ver Histórico Completo
        </button>
      </div>
      
        {/* Configurações Avançadas */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">⚙️ Configurações Avançadas</h3>
          
          {/* Validação Telegram */}
          <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h4 className="font-semibold text-white mb-3">🔐 Validação de Telegram</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status da Validação</label>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400 font-medium">PENDENTE</span>
                  <button className="ml-auto bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded text-sm">
                    Validar Agora
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-2">Seu UUID de Validação:</div>
                <div className="flex items-center space-x-2">
                  <code className="bg-black/30 px-3 py-1 rounded text-green-400 font-mono text-sm flex-1">
                    CRP-7A8B9C2D-E3F4-5G6H-I7J8-K9L0M1N2O3P4
                  </code>
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-2 py-1 rounded text-xs">
                    Copiar
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 space-y-1">
                <p>📋 <strong>Como validar:</strong></p>
                <p>1. Envie o UUID acima para nosso bot: <code className="bg-black/30 px-1 rounded">@CryptoAnalyzerBot</code></p>
                <p>2. Digite: <code className="bg-black/30 px-1 rounded">/validate CRP-7A8B9C2D-E3F4-5G6H-I7J8-K9L0M1N2O3P4</code></p>
                <p>3. Aguarde confirmação e clique em "Validar Agora"</p>
                <p>🔒 Isso garante que apenas você pode receber sinais neste Telegram</p>
              </div>
            </div>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Gestão de Risco</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss Automático</label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Ativar para todos os trades</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Take Profit Parcial</label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">50% no TP1, 30% no TP2, 20% no TP3</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Drawdown</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  defaultValue="5"
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white w-16"
                />
                <span className="text-gray-300">% - Pausar bot se atingir</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Filtros de Sinais</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confiança Mínima</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="range" 
                  min="50" 
                  max="95" 
                  defaultValue="75"
                  className="flex-1"
                />
                <span className="text-white font-medium w-8">75%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Pares Permitidos</label>
              <select 
                defaultValue="todos"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                style={{
                  backgroundColor: '#1f2937',
                  color: '#ffffff'
                }}
              >
                <option value="todos" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>✅ Todos os Pares (353+ pares - Recomendado)</option>
                
                <optgroup label="🔥 Principais (10)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="BTC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BTC/USDT</option>
                  <option value="ETH/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ETH/USDT</option>
                  <option value="SOL/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SOL/USDT</option>
                  <option value="XRP/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>XRP/USDT</option>
                  <option value="ADA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ADA/USDT</option>
                  <option value="AVAX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>AVAX/USDT</option>
                  <option value="DOT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>DOT/USDT</option>
                  <option value="MATIC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>MATIC/USDT</option>
                  <option value="LINK/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>LINK/USDT</option>
                  <option value="UNI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>UNI/USDT</option>
                </optgroup>
                
                <optgroup label="💎 Top 50 Altcoins (20)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="LTC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>LTC/USDT</option>
                  <option value="BCH/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BCH/USDT</option>
                  <option value="ATOM/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ATOM/USDT</option>
                  <option value="FIL/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FIL/USDT</option>
                  <option value="ICP/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ICP/USDT</option>
                  <option value="NEAR/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>NEAR/USDT</option>
                  <option value="ALGO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ALGO/USDT</option>
                  <option value="VET/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>VET/USDT</option>
                  <option value="HBAR/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>HBAR/USDT</option>
                  <option value="EGLD/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>EGLD/USDT</option>
                  <option value="FTM/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FTM/USDT</option>
                  <option value="ONE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ONE/USDT</option>
                  <option value="THETA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>THETA/USDT</option>
                  <option value="XTZ/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>XTZ/USDT</option>
                  <option value="EOS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>EOS/USDT</option>
                  <option value="TRX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>TRX/USDT</option>
                  <option value="XLM/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>XLM/USDT</option>
                  <option value="KAVA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>KAVA/USDT</option>
                  <option value="ZIL/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ZIL/USDT</option>
                  <option value="BAT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BAT/USDT</option>
                </optgroup>
                
                <optgroup label="🚀 DeFi & Yield (15)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="AAVE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>AAVE/USDT</option>
                  <option value="COMP/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>COMP/USDT</option>
                  <option value="SUSHI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SUSHI/USDT</option>
                  <option value="CRV/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>CRV/USDT</option>
                  <option value="YFI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>YFI/USDT</option>
                  <option value="SNX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SNX/USDT</option>
                  <option value="MKR/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>MKR/USDT</option>
                  <option value="RUNE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>RUNE/USDT</option>
                  <option value="CAKE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>CAKE/USDT</option>
                  <option value="ALPHA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ALPHA/USDT</option>
                  <option value="LDO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>LDO/USDT</option>
                  <option value="RPL/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>RPL/USDT</option>
                  <option value="CVX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>CVX/USDT</option>
                  <option value="BAL/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BAL/USDT</option>
                  <option value="AURA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>AURA/USDT</option>
                </optgroup>
                
                <optgroup label="⚡ Layer 2 & Scaling (10)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="ARB/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ARB/USDT</option>
                  <option value="OP/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>OP/USDT</option>
                  <option value="LRC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>LRC/USDT</option>
                  <option value="IMX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>IMX/USDT</option>
                  <option value="STRK/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>STRK/USDT</option>
                  <option value="METIS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>METIS/USDT</option>
                  <option value="BOBA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BOBA/USDT</option>
                  <option value="CELR/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>CELR/USDT</option>
                  <option value="SYN/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SYN/USDT</option>
                  <option value="POLY/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>POLY/USDT</option>
                </optgroup>
                
                <optgroup label="🎮 Gaming & NFT (15)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="AXS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>AXS/USDT</option>
                  <option value="SAND/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SAND/USDT</option>
                  <option value="MANA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>MANA/USDT</option>
                  <option value="ENJ/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ENJ/USDT</option>
                  <option value="GALA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GALA/USDT</option>
                  <option value="FLOW/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FLOW/USDT</option>
                  <option value="CHZ/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>CHZ/USDT</option>
                  <option value="APE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>APE/USDT</option>
                  <option value="GMT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GMT/USDT</option>
                  <option value="ILV/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ILV/USDT</option>
                  <option value="ALICE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ALICE/USDT</option>
                  <option value="TLM/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>TLM/USDT</option>
                  <option value="GHST/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GHST/USDT</option>
                  <option value="REVV/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>REVV/USDT</option>
                  <option value="TOWER/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>TOWER/USDT</option>
                </optgroup>
                
                <optgroup label="🔥 Meme Coins (13)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="DOGE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>DOGE/USDT</option>
                  <option value="SHIB/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SHIB/USDT</option>
                  <option value="PEPE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>PEPE/USDT</option>
                  <option value="FLOKI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FLOKI/USDT</option>
                  <option value="WIF/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>WIF/USDT</option>
                  <option value="BOME/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BOME/USDT</option>
                  <option value="1000BONK/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>1000BONK/USDT</option>
                  <option value="1000FLOKI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>1000FLOKI/USDT</option>
                  <option value="10000LADYS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>10000LADYS/USDT</option>
                  <option value="1000PEPE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>1000PEPE/USDT</option>
                  <option value="MEME/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>MEME/USDT</option>
                  <option value="PEPE2/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>PEPE2/USDT</option>
                  <option value="WEN/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>WEN/USDT</option>
                </optgroup>
                
                <optgroup label="🤖 AI & Data (15)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="TAO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>TAO/USDT</option>
                  <option value="FET/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FET/USDT</option>
                  <option value="AGIX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>AGIX/USDT</option>
                  <option value="OCEAN/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>OCEAN/USDT</option>
                  <option value="GRT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GRT/USDT</option>
                  <option value="RNDR/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>RNDR/USDT</option>
                  <option value="WLD/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>WLD/USDT</option>
                  <option value="AI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>AI/USDT</option>
                  <option value="ARKM/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ARKM/USDT</option>
                  <option value="PHB/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>PHB/USDT</option>
                  <option value="ORAI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ORAI/USDT</option>
                  <option value="BAND/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BAND/USDT</option>
                  <option value="TRB/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>TRB/USDT</option>
                  <option value="API3/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>API3/USDT</option>
                  <option value="FLUX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FLUX/USDT</option>
                </optgroup>
                
                <optgroup label="🌟 Novos Listados (20)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="SUI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SUI/USDT</option>
                  <option value="APT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>APT/USDT</option>
                  <option value="BLUR/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BLUR/USDT</option>
                  <option value="ID/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ID/USDT</option>
                  <option value="RDNT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>RDNT/USDT</option>
                  <option value="GMX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GMX/USDT</option>
                  <option value="MAGIC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>MAGIC/USDT</option>
                  <option value="GRAIL/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GRAIL/USDT</option>
                  <option value="JTO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>JTO/USDT</option>
                  <option value="PYTH/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>PYTH/USDT</option>
                  <option value="ENA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ENA/USDT</option>
                  <option value="OMNI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>OMNI/USDT</option>
                  <option value="REZ/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>REZ/USDT</option>
                  <option value="IO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>IO/USDT</option>
                  <option value="ZK/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ZK/USDT</option>
                  <option value="LISTA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>LISTA/USDT</option>
                  <option value="ZRO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ZRO/USDT</option>
                  <option value="G/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>G/USDT</option>
                  <option value="BANANA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BANANA/USDT</option>
                  <option value="TON/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>TON/USDT</option>
                </optgroup>
                
                <optgroup label="🟠 Bitcoin Ecosystem (6)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="BTC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BTC/USDT</option>
                  <option value="ORDI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ORDI/USDT</option>
                  <option value="SATS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SATS/USDT</option>
                  <option value="RATS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>RATS/USDT</option>
                  <option value="1000SATS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>1000SATS/USDT</option>
                  <option value="MUBI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>MUBI/USDT</option>
                </optgroup>
                
                <optgroup label="🟣 Solana Ecosystem (10)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="SOL/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SOL/USDT</option>
                  <option value="RAY/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>RAY/USDT</option>
                  <option value="SRM/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SRM/USDT</option>
                  <option value="FIDA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FIDA/USDT</option>
                  <option value="STEP/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>STEP/USDT</option>
                  <option value="ATLAS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ATLAS/USDT</option>
                  <option value="POLIS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>POLIS/USDT</option>
                  <option value="SAMO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SAMO/USDT</option>
                  <option value="COPE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>COPE/USDT</option>
                  <option value="ROPE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ROPE/USDT</option>
                </optgroup>
                
                <optgroup label="⚛️ Cosmos Ecosystem (10)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="ATOM/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ATOM/USDT</option>
                  <option value="OSMO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>OSMO/USDT</option>
                  <option value="JUNO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>JUNO/USDT</option>
                  <option value="SCRT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SCRT/USDT</option>
                  <option value="INJ/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>INJ/USDT</option>
                  <option value="KUJI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>KUJI/USDT</option>
                  <option value="ROWAN/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ROWAN/USDT</option>
                  <option value="LUNA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>LUNA/USDT</option>
                  <option value="LUNC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>LUNC/USDT</option>
                  <option value="USTC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>USTC/USDT</option>
                </optgroup>
                
                <optgroup label="🔷 Arbitrum Ecosystem (10)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="ARB/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ARB/USDT</option>
                  <option value="GMX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GMX/USDT</option>
                  <option value="GNS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GNS/USDT</option>
                  <option value="MAGIC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>MAGIC/USDT</option>
                  <option value="GRAIL/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>GRAIL/USDT</option>
                  <option value="RDNT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>RDNT/USDT</option>
                  <option value="PENDLE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>PENDLE/USDT</option>
                  <option value="JONES/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>JONES/USDT</option>
                  <option value="VELA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>VELA/USDT</option>
                  <option value="Y2K/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Y2K/USDT</option>
                </optgroup>
                
                <optgroup label="🟡 BNB Chain Ecosystem (10)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="BNB/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BNB/USDT</option>
                  <option value="CAKE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>CAKE/USDT</option>
                  <option value="AUTO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>AUTO/USDT</option>
                  <option value="BIFI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BIFI/USDT</option>
                  <option value="BELT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BELT/USDT</option>
                  <option value="ALPACA/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ALPACA/USDT</option>
                  <option value="XVS/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>XVS/USDT</option>
                  <option value="VAI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>VAI/USDT</option>
                  <option value="SXP/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SXP/USDT</option>
                  <option value="TWT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>TWT/USDT</option>
                </optgroup>
                
                <optgroup label="💰 Stablecoins & Exchange (10)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="USDC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>USDC/USDT</option>
                  <option value="DAI/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>DAI/USDT</option>
                  <option value="FRAX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FRAX/USDT</option>
                  <option value="USDD/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>USDD/USDT</option>
                  <option value="TUSD/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>TUSD/USDT</option>
                  <option value="BNB/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BNB/USDT</option>
                  <option value="OKB/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>OKB/USDT</option>
                  <option value="HT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>HT/USDT</option>
                  <option value="LEO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>LEO/USDT</option>
                  <option value="CRO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>CRO/USDT</option>
                </optgroup>
                
                <optgroup label="📊 Outros Populares (20)" style={{backgroundColor: '#374151', color: '#ffffff', fontWeight: 'bold'}}>
                  <option value="ZRX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ZRX/USDT</option>
                  <option value="1INCH/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>1INCH/USDT</option>
                  <option value="DYDX/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>DYDX/USDT</option>
                  <option value="PERP/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>PERP/USDT</option>
                  <option value="MASK/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>MASK/USDT</option>
                  <option value="AUDIO/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>AUDIO/USDT</option>
                  <option value="STORJ/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>STORJ/USDT</option>
                  <option value="KNC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>KNC/USDT</option>
                  <option value="REN/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>REN/USDT</option>
                  <option value="C98/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>C98/USDT</option>
                  <option value="JASMY/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>JASMY/USDT</option>
                  <option value="ROSE/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ROSE/USDT</option>
                  <option value="BLZ/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>BLZ/USDT</option>
                  <option value="REEF/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>REEF/USDT</option>
                  <option value="ACH/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>ACH/USDT</option>
                  <option value="CLV/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>CLV/USDT</option>
                  <option value="YGG/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>YGG/USDT</option>
                  <option value="FRONT/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>FRONT/USDT</option>
                  <option value="SFP/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>SFP/USDT</option>
                  <option value="1000XEC/USDT" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>1000XEC/USDT</option>
                </optgroup>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                💡 "Todos" permite trading em qualquer par USDT disponível na ByBit
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Horário de Operação</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="time" 
                  defaultValue="09:00"
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                />
                <span className="text-gray-300">até</span>
                <input 
                  type="time" 
                  defaultValue="18:00"
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex space-x-4">
            <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-6 py-2 rounded font-medium">
              Salvar Configurações
            </button>
            <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-6 py-2 rounded font-medium">
              Testar Conexão ByBit
            </button>
            <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-6 py-2 rounded font-medium">
              Configurar API Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCourses = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Cursos de Trading</h2>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-2xl font-bold text-white mb-2">Cursos em Desenvolvimento</h3>
          <p className="text-gray-300 mb-6">
            Estamos preparando cursos completos de análise técnica, gestão de risco e estratégias avançadas de trading.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">📊 Análise Técnica</h4>
            <p className="text-sm text-gray-300">Indicadores, padrões e estratégias</p>
          </div>
          <div className="bg-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">⚖️ Gestão de Risco</h4>
            <p className="text-sm text-gray-300">Stop loss, take profit e position sizing</p>
          </div>
          <div className="bg-green-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">🚀 Estratégias Avançadas</h4>
            <p className="text-sm text-gray-300">Scalping, swing trade e long term</p>
          </div>
        </div>
        
        <div className="bg-yellow-500/20 rounded-lg p-4">
          <p className="text-yellow-400 font-medium">🚧 Em breve disponível para usuários ALPHA</p>
        </div>
      </div>
    </div>
  )

  const renderCopyTrading = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Copy Trading</h2>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Funcionalidade em Desenvolvimento</h3>
        <p className="text-gray-300 mb-6">
          O sistema de Copy Trading está sendo finalizado e estará disponível em breve.
        </p>
        <div className="text-blue-400">🚧 Em Construção 🚧</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            NexoCrypto
          </h1>
          <p className="text-gray-300">
            Plataforma Avançada de Análise Crypto
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 space-x-2">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'signals', label: '📈 Sinais', icon: '📈' },
            { id: 'gems', label: '💎 Gems', icon: '💎' },
            { id: 'news', label: '📰 Notícias', icon: '📰' },
            { id: 'courses', label: '🎓 Cursos', icon: '🎓' },
            { id: 'auto-trading', label: '🤖 Auto Trading', icon: '🤖' },
            { id: 'copy-trading', label: '👥 Copy Trading', icon: '👥' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'signals' && renderSignals()}
          {activeTab === 'gems' && renderGems()}
          {activeTab === 'news' && renderNews()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'auto-trading' && renderAutoTrading()}
          {activeTab === 'copy-trading' && renderCopyTrading()}
        </div>
      </div>
    </div>
  )
}

export default App

