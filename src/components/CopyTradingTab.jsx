import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Star,
  Copy,
  Settings,
  Play,
  Pause,
  Square,
  DollarSign,
  Target,
  AlertTriangle
} from 'lucide-react'

const CopyTradingTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('traders')
  const [topTraders, setTopTraders] = useState([])
  const [dcaBots, setDcaBots] = useState([])
  const [loading, setLoading] = useState(true)

  // Dados simulados para demonstração
  const mockTraders = [
    {
      trader_id: "crypto_king_br",
      name: "Crypto King BR",
      success_rate: 87.3,
      total_trades: 1247,
      avg_profit: 12.4,
      max_drawdown: 8.2,
      risk_score: 3,
      followers: 2847,
      verified: true,
      subscription_fee: 99.90,
      description: "Especialista em BTC e altcoins principais. Foco em swing trading.",
      specialties: ["BTC", "ETH", "Swing Trading"]
    },
    {
      trader_id: "defi_master",
      name: "DeFi Master",
      success_rate: 82.1,
      total_trades: 892,
      avg_profit: 18.7,
      max_drawdown: 15.3,
      risk_score: 5,
      followers: 1523,
      verified: true,
      subscription_fee: 149.90,
      description: "Especialista em tokens DeFi e yield farming strategies.",
      specialties: ["DeFi", "Yield Farming", "Altcoins"]
    },
    {
      trader_id: "scalp_pro",
      name: "Scalp Pro",
      success_rate: 91.2,
      total_trades: 3421,
      avg_profit: 3.8,
      max_drawdown: 5.1,
      risk_score: 2,
      followers: 4231,
      verified: true,
      subscription_fee: 199.90,
      description: "Scalping profissional com alta frequência de trades.",
      specialties: ["Scalping", "BTC", "ETH"]
    }
  ]

  const mockDcaBots = [
    {
      bot_id: "btc_dca_conservative",
      pair: "BTCUSDT",
      strategy: "Conservador",
      total_invested: 2500.0,
      current_value: 2847.5,
      profit_loss: 347.5,
      profit_percentage: 13.9,
      levels_executed: 3,
      total_levels: 5,
      status: "active",
      next_trigger: 42800
    },
    {
      bot_id: "eth_dca_aggressive",
      pair: "ETHUSDT", 
      strategy: "Agressivo",
      total_invested: 1800.0,
      current_value: 1654.2,
      profit_loss: -145.8,
      profit_percentage: -8.1,
      levels_executed: 4,
      total_levels: 8,
      status: "active",
      next_trigger: 3420
    }
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setTopTraders(mockTraders)
      setDcaBots(mockDcaBots)
      setLoading(false)
    }, 1000)
  }, [])

  const getRiskColor = (riskScore) => {
    if (riskScore <= 3) return 'text-green-400'
    if (riskScore <= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskLabel = (riskScore) => {
    if (riskScore <= 3) return 'Baixo'
    if (riskScore <= 6) return 'Médio'
    return 'Alto'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-white/10">
          <TabsTrigger value="traders" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Top Traders
          </TabsTrigger>
          <TabsTrigger value="dca" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            DCA Bots
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600">
            <Target className="w-4 h-4 mr-2" />
            Portfolio
          </TabsTrigger>
        </TabsList>

        {/* Top Traders Tab */}
        <TabsContent value="traders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {topTraders.map((trader, index) => (
              <Card key={trader.trader_id} className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-white">{trader.name}</CardTitle>
                      {trader.verified && (
                        <Badge variant="default" className="bg-blue-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(trader.success_rate / 20) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    {trader.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Taxa de Sucesso</p>
                      <p className="text-lg font-bold text-green-400">{trader.success_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Lucro Médio</p>
                      <p className="text-lg font-bold text-green-400">+{trader.avg_profit}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Max Drawdown</p>
                      <p className="text-white font-medium">{trader.max_drawdown}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Risco</p>
                      <p className={`font-medium ${getRiskColor(trader.risk_score)}`}>
                        {getRiskLabel(trader.risk_score)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Trades</p>
                      <p className="text-white font-medium">{trader.total_trades.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Seguidores</p>
                      <p className="text-white font-medium">{trader.followers.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {trader.specialties.map((specialty, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-sm text-gray-400">Assinatura</p>
                      <p className="text-white font-bold">R$ {trader.subscription_fee}/mês</p>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>

                  <Progress value={trader.success_rate} className="w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* DCA Bots Tab */}
        <TabsContent value="dca" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Bots DCA Ativos</h3>
            <Button className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Novo Bot DCA
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dcaBots.map((bot, index) => (
              <Card key={bot.bot_id} className="bg-black/20 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{bot.pair}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Estratégia: {bot.strategy}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.status)}`} />
                      <span className="text-sm text-gray-400 capitalize">{bot.status}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Investido</p>
                      <p className="text-lg font-bold text-white">
                        ${bot.total_invested.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Valor Atual</p>
                      <p className="text-lg font-bold text-white">
                        ${bot.current_value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">P&L</p>
                      <p className={`text-lg font-bold ${bot.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {bot.profit_loss >= 0 ? '+' : ''}${bot.profit_loss.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">P&L %</p>
                      <p className={`text-lg font-bold ${bot.profit_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {bot.profit_percentage >= 0 ? '+' : ''}{bot.profit_percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Níveis Executados</span>
                      <span>{bot.levels_executed}/{bot.total_levels}</span>
                    </div>
                    <Progress 
                      value={(bot.levels_executed / bot.total_levels) * 100} 
                      className="w-full" 
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Próximo Trigger</p>
                    <p className="text-white font-medium">${bot.next_trigger.toLocaleString()}</p>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-white/10">
                    <Button variant="outline" size="sm">
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Square className="w-4 h-4 mr-2" />
                      Parar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Investido</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$4,300</div>
                <p className="text-xs text-gray-400">Copy Trading + DCA</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">P&L Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">+$201.7</div>
                <p className="text-xs text-green-400">+4.7% este mês</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Traders Seguidos</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
                <p className="text-xs text-gray-400">2 ativos, 1 pausado</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Bots DCA</CardTitle>
                <Target className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">2</div>
                <p className="text-xs text-gray-400">Ambos ativos</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/20 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Performance Mensal</CardTitle>
              <CardDescription className="text-gray-400">
                Comparação entre Copy Trading e DCA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="text-white">Copy Trading</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">+$156.3</div>
                    <div className="text-sm text-gray-400">+7.2%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="text-white">DCA Bots</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">+$45.4</div>
                    <div className="text-sm text-gray-400">+2.1%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CopyTradingTab

