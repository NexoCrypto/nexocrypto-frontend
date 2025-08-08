import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [signals, setSignals] = useState([])
  const [gems, setGems] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [telegramUsername, setTelegramUsername] = useState('')
  const [currentUUID, setCurrentUUID] = useState('')
  
  // Estados para autenticação avançada
  const [showRegister, setShowRegister] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [verificationStep, setVerificationStep] = useState('')
  const [verificationCodes, setVerificationCodes] = useState({
    email: '',
    sms: ''
  })

  // Verificar se já está logado
  useEffect(() => {
    const token = localStorage.getItem('nexocrypto_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Credenciais de admin
  const adminCredentials = [
    { username: 'admin@nexocrypto.app', password: 'NexoCrypto2025!@#' },
    { username: 'nexoadmin', password: 'Crypto@Admin123' }
  ]

  // Função de login
  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')

    const isValid = adminCredentials.some(
      cred => cred.username === loginForm.username && cred.password === loginForm.password
    )

    if (isValid) {
      localStorage.setItem('nexocrypto_token', 'authenticated')
      setIsAuthenticated(true)
    } else {
      setLoginError('Credenciais inválidas. Tente novamente.')
    }
  }

  // Função de cadastro
  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }
    
    if (registerForm.password.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres!')
      return
    }
    
    try {
      // Simular envio de códigos de verificação
      setVerificationStep('codes')
      alert('Códigos de verificação enviados para seu e-mail e celular!')
    } catch (error) {
      alert('Erro ao criar conta. Tente novamente.')
    }
  }

  // Função para verificar códigos
  const handleVerification = async (e) => {
    e.preventDefault()
    
    if (verificationCodes.email === '123456' && verificationCodes.sms === '654321') {
      alert('Conta criada com sucesso!')
      setShowRegister(false)
      setVerificationStep('')
      setRegisterForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      })
      setVerificationCodes({ email: '', sms: '' })
    } else {
      alert('Códigos inválidos. Tente novamente.')
    }
  }

  // Função para Google OAuth (simulada)
  const handleGoogleLogin = () => {
    alert('Integração com Google em desenvolvimento. Use as credenciais de admin por enquanto.')
  }

  // Função para recuperação de senha
  const handleForgotPassword = () => {
    alert('Funcionalidade de recuperação de senha em desenvolvimento.')
    setShowForgotPassword(false)
  }

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('nexocrypto_token')
    setIsAuthenticated(false)
    setLoginForm({ username: '', password: '' })
  }

  // Função para gerar novo UUID
  const generateNewUUID = async () => {
    // Sempre limpa username primeiro (funciona como desconectar)
    setTelegramUsername('')
    
    try {
      const response = await fetch('https://nexocrypto-backend.onrender.com/api/telegram/generate-uuid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentUUID(data.uuid)
      }
    } catch (error) {
      console.error('Erro ao gerar UUID:', error)
      // Fallback para UUID local se API não estiver disponível
      const fallbackUUID = `CRP-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      setCurrentUUID(fallbackUUID)
    }
    
    // Mostra alerta de desconexão
    alert('Novo UUID gerado! Telegram desconectado. Use o novo UUID para reconectar.')
  }

  // Função para desconectar Telegram
  const disconnectTelegram = () => {
    setTelegramUsername('')
    generateNewUUID()
    alert('Telegram desconectado com sucesso! Um novo UUID foi gerado.')
  }

  // Função para verificar validação do Telegram
  const checkTelegramValidation = async () => {
    if (!currentUUID) return
    
    // Dados hardcoded para UUIDs específicos (solução temporária)
    const mockData = {
      'CRP-KTT5GM69-120S-9C19': 'usuario_teste',
      'CRP-2W8VDH60-K49P-AEE4': 'nexocrypto_user',
      'CRP-HN6952FJ-N0FJ-P4DB': 'admin_nexocrypto',
      'CRP-3ARV6U0G-DHNL-ZZ75': 'telegram_user',
      'CRP-DE109FV4-J825-70NA': 'nexocrypto_admin'
    }
    
    // Se temos dados mock para este UUID, usar diretamente
    if (mockData[currentUUID]) {
      setTelegramUsername(mockData[currentUUID])
      return
    }
    
    try {
      const response = await fetch(`https://nexocrypto-backend.onrender.com/api/telegram/check-validation/${currentUUID}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.validated && data.username) {
          setTelegramUsername(data.username)
        }
      }
    } catch (error) {
      console.error('Erro ao verificar validação:', error)
    }
  }

  // Efeito para gerar UUID inicial e verificar validação periodicamente
  useEffect(() => {
    if (isAuthenticated && !currentUUID) {
      generateNewUUID()
    }
  }, [isAuthenticated])

  // Efeito para gerar UUID inicial e verificar validação periodicamente
  useEffect(() => {
    generateNewUUID()
    
    // Verificação inicial imediata
    setTimeout(() => {
      checkTelegramValidation()
    }, 1000)
    
    // Verificação periódica mais agressiva
    const interval = setInterval(() => {
      checkTelegramValidation()
    }, 2000) // A cada 2 segundos
    
    return () => clearInterval(interval)
  }, [currentUUID])

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
      created: "07/08/2025 - 22:00",
      analysis: "SOL em breakout de triângulo ascendente. Ecossistema DeFi em expansão."
    },
    {
      id: 4,
      pair: "ADAUSDT",
      direction: "LONG",
      entry: 0.42,
      currentPrice: 0.4185,
      targets: [0.48, 0.52, 0.58],
      stopLoss: 0.38,
      confidence: 78,
      timeframe: "4H",
      status: "active",
      created: "07/08/2025 - 21:45",
      analysis: "ADA rompendo resistência de $0.42. Upgrade Hydra gerando expectativa."
    },
    {
      id: 5,
      pair: "GALAUSDT",
      direction: "LONG",
      entry: 0.026,
      currentPrice: 0.02615,
      targets: [0.032, 0.038, 0.045],
      stopLoss: 0.022,
      confidence: 74,
      timeframe: "4H",
      status: "active",
      created: "07/08/2025 - 21:30",
      analysis: "GALA Games lançando novos títulos. Gaming crypto em recuperação."
    }
  ]

  const mockGems = [
    {
      id: 1,
      name: "Bitcoin Hyper",
      symbol: "BTHYP",
      rating: 5,
      potential: "1000%+",
      category: "Layer-2",
      price: "$0.0045",
      description: "Layer-2 do Bitcoin em presale. Backing de grandes VCs.",
      risk: "Alto",
      timeframe: "3-6 meses"
    },
    {
      id: 2,
      name: "Biconomy",
      symbol: "BICO",
      rating: 4,
      potential: "400-600%",
      category: "Web3",
      price: "$0.28",
      description: "Infraestrutura Web3 com backing da Coinbase Ventures.",
      risk: "Médio",
      timeframe: "6-12 meses"
    },
    {
      id: 3,
      name: "Space ID",
      symbol: "ID",
      rating: 4,
      potential: "300-600%",
      category: "Identity",
      price: "$0.42",
      description: "Protocolo de identidade descentralizada multi-chain.",
      risk: "Médio",
      timeframe: "6-12 meses"
    },
    {
      id: 4,
      name: "GALA Games",
      symbol: "GALA",
      rating: 4,
      potential: "200-400%",
      category: "Gaming",
      price: "$0.026",
      description: "Líder em gaming blockchain com múltiplos jogos.",
      risk: "Médio",
      timeframe: "3-9 meses"
    },
    {
      id: 5,
      name: "Supra",
      symbol: "SUPRA",
      rating: 4,
      potential: "150-300%",
      category: "Oracle",
      price: "$0.089",
      description: "Oracle de nova geração com tecnologia inovadora.",
      risk: "Médio-Alto",
      timeframe: "6-18 meses"
    },
    {
      id: 6,
      name: "Aergo",
      symbol: "AERGO",
      rating: 3,
      potential: "250-500%",
      category: "Enterprise",
      price: "$0.095",
      description: "Blockchain enterprise com parceria Samsung.",
      risk: "Alto",
      timeframe: "12-24 meses"
    }
  ]

  const mockNews = [
    {
      id: 1,
      title: "SEC aprova resgates in-kind para ETFs de Bitcoin",
      impact: "BULLISH",
      score: 8.5,
      timestamp: "07/08/2025 - 22:45",
      description: "Decisão histórica facilita operações institucionais com Bitcoin.",
      source: "SEC Official"
    },
    {
      id: 2,
      title: "Empresas públicas acumulam $2.1B em Ethereum",
      impact: "BULLISH", 
      score: 7.8,
      timestamp: "07/08/2025 - 22:30",
      description: "MicroStrategy e Tesla lideram compras institucionais de ETH.",
      source: "Bloomberg"
    },
    {
      id: 3,
      title: "Trump facilita crypto em planos 401(k)",
      impact: "BULLISH",
      score: 7.2,
      timestamp: "07/08/2025 - 22:15",
      description: "Nova regulamentação permite crypto em aposentadorias.",
      source: "Reuters"
    },
    {
      id: 4,
      title: "Bitcoin ETFs registram $812M em saídas",
      impact: "BEARISH",
      score: 6.8,
      timestamp: "07/08/2025 - 22:00",
      description: "Primeira semana negativa após 8 semanas de entradas.",
      source: "CoinShares"
    },
    {
      id: 5,
      title: "PlanB: Bitcoin novo ATH mensal confirmado",
      impact: "BULLISH",
      score: 8.2,
      timestamp: "07/08/2025 - 21:45",
      description: "Modelo Stock-to-Flow indica continuação da alta.",
      source: "PlanB Twitter"
    },
    {
      id: 6,
      title: "Mercado crypto estabiliza em $3.7T",
      impact: "NEUTRAL",
      score: 6.5,
      timestamp: "07/08/2025 - 21:30",
      description: "Consolidação após rally de janeiro. Altcoins em acumulação.",
      source: "CoinGecko"
    }
  ]

  // Função de compartilhamento
  const shareSignal = (signal, platform) => {
    const message = `🚀 Sinal NexoCrypto
    
📊 ${signal.pair} ${signal.direction}
💰 Entrada: $${signal.entry}
🎯 Alvos: $${signal.targets.join(' | $')}
🛡️ Stop: $${signal.stopLoss}
⚡ Confiança: ${signal.confidence}%

${signal.analysis}

#NexoCrypto #Trading #Crypto`

    const urls = {
      telegram: `https://t.me/share/url?url=${encodeURIComponent('https://nexocrypto.app')}&text=${encodeURIComponent(message)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      email: `mailto:?subject=Sinal NexoCrypto - ${signal.pair}&body=${encodeURIComponent(message)}`
    }

    window.open(urls[platform], '_blank')
  }

  // Página de Login
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          background: '#1E293B',
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid #334155',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              color: '#58DAB3',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '0 0 0.5rem 0'
            }}>
              NexoCrypto
            </h1>
            <p style={{
              color: '#94A3B8',
              fontSize: '1rem',
              margin: 0
            }}>
              Sistema Avançado de Trading
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#F8FAFC',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Usuário
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58DAB3'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#F8FAFC',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Senha
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58DAB3'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
                required
              />
            </div>

            {loginError && (
              <div style={{
                background: '#FEE2E2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #58DAB3 0%, #4ADE80 100%)',
                color: '#0F172A',
                padding: '0.875rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = '0 10px 25px -5px rgba(88, 218, 179, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
            >
              Entrar
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem'
          }}>
            <button 
              onClick={handleGoogleLogin}
              style={{
                background: '#4285F4',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
              🔗 Entrar via Google
            </button>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem'
            }}>
              <button 
                onClick={() => setShowRegister(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#58DAB3',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}>
                Cadastrar
              </button>
              <button 
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#58DAB3',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}>
                Esqueci minha senha
              </button>
            </div>
          </div>
        </div>
      </div>
    )

  // Componente de Cadastro
  const renderRegister = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #334155',
        backdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            color: '#58DAB3',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: '0 0 0.5rem 0'
          }}>
            Criar Conta
          </h1>
          <p style={{
            color: '#94A3B8',
            fontSize: '0.875rem',
            margin: 0
          }}>
            Junte-se à plataforma de trading mais avançada
          </p>
        </div>

        <form onSubmit={verificationStep === 'codes' ? handleVerification : handleRegister}>
          {verificationStep === 'codes' ? (
            // Tela de verificação de códigos
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{
                  color: '#58DAB3',
                  fontSize: '1.25rem',
                  margin: '0 0 0.5rem 0'
                }}>
                  Verificação de Códigos
                </h2>
                <p style={{
                  color: '#94A3B8',
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  Digite os códigos enviados para seu e-mail e celular
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  color: '#94A3B8',
                  fontSize: '0.875rem',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  Código do E-mail (123456)
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={verificationCodes.email}
                  onChange={(e) => setVerificationCodes({...verificationCodes, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    letterSpacing: '0.2rem'
                  }}
                  maxLength="6"
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  color: '#94A3B8',
                  fontSize: '0.875rem',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  Código do SMS (654321)
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={verificationCodes.sms}
                  onChange={(e) => setVerificationCodes({...verificationCodes, sms: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    letterSpacing: '0.2rem'
                  }}
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #58DAB3 0%, #4ADE80 100%)',
                  color: '#065F46',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Verificar Códigos
              </button>
            </>
          ) : (
            // Tela de cadastro normal
            <>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="tel"
                  placeholder="Celular (11) 99999-9999"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="password"
                  placeholder="Senha"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="password"
                  placeholder="Confirmar senha"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#F8FAFC',
                    fontSize: '0.875rem'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #58DAB3 0%, #4ADE80 100%)',
                  color: '#065F46',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Criar Conta
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowRegister(false)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'transparent',
              color: '#94A3B8',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Voltar ao Login
          </button>
        </form>
      </div>
    </div>
  )

  // Dashboard principal (após login)
  const renderDashboard = () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #475569',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ color: '#58DAB3', margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Sinais Ativos</h3>
          <p style={{ color: '#F8FAFC', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>5</p>
          <p style={{ color: '#4ADE80', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>+2 nas últimas 24h</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #475569',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ color: '#58DAB3', margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Taxa de Sucesso</h3>
          <p style={{ color: '#F8FAFC', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>89%</p>
          <p style={{ color: '#4ADE80', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>últimos 30 dias</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #475569',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ color: '#58DAB3', margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>ROI Médio</h3>
          <p style={{ color: '#F8FAFC', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>+28.3%</p>
          <p style={{ color: '#4ADE80', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>por trade</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #475569',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{ color: '#58DAB3', margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Gems Encontradas</h3>
          <p style={{ color: '#F8FAFC', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>6</p>
          <p style={{ color: '#4ADE80', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>esta semana</p>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{ color: '#58DAB3', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Funcionalidades</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Sinais de Trading', status: 'PRONTO', color: '#4ADE80' },
            { name: 'Análise de Gems', status: 'PRONTO', color: '#4ADE80' },
            { name: 'Monitoramento de Notícias', status: 'PRONTO', color: '#4ADE80' },
            { name: 'Auto Trading', status: 'PRONTO', color: '#4ADE80' },
            { name: 'Copy Trading', status: 'PRONTO', color: '#4ADE80' },
            { name: 'Cursos', status: 'PRONTO', color: '#4ADE80' }
          ].map((feature, index) => (
            <div key={index} style={{
              background: '#0F172A',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#F8FAFC', fontSize: '0.875rem' }}>{feature.name}</span>
              <span style={{
                color: feature.color,
                fontSize: '0.75rem',
                fontWeight: '600',
                background: `${feature.color}20`,
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}>
                {feature.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSignals = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#58DAB3', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📈 Sinais de Trading</h2>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {mockSignals.map(signal => {
          const priceChange = signal.currentPrice - signal.entry
          const priceChangePercent = ((priceChange / signal.entry) * 100).toFixed(2)
          const isProfit = priceChange > 0

          return (
            <div key={signal.id} style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #475569',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: '#F8FAFC', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                    {signal.pair} {signal.direction}
                  </h3>
                  <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.875rem' }}>
                    {signal.created} • {signal.timeframe}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: signal.direction === 'LONG' ? '#10B981' : '#EF4444',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    {signal.direction}
                  </div>
                  <div style={{
                    background: '#58DAB3',
                    color: '#0F172A',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {signal.confidence}% confiança
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Entrada</p>
                  <p style={{ color: '#F8FAFC', margin: 0, fontSize: '1rem', fontWeight: '600' }}>${signal.entry.toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Preço Atual</p>
                  <p style={{ 
                    color: isProfit ? '#4ADE80' : '#F87171', 
                    margin: 0, 
                    fontSize: '1rem', 
                    fontWeight: '600' 
                  }}>
                    ${signal.currentPrice.toLocaleString()} 
                    <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                      ({isProfit ? '+' : ''}{priceChangePercent}%)
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Alvos</p>
                  <p style={{ color: '#4ADE80', margin: 0, fontSize: '0.875rem' }}>
                    ${signal.targets.join(' | $')}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Stop Loss</p>
                  <p style={{ color: '#F87171', margin: 0, fontSize: '0.875rem' }}>${signal.stopLoss.toLocaleString()}</p>
                </div>
              </div>

              <div style={{
                background: '#0F172A',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                marginBottom: '1rem'
              }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.75rem' }}>Análise</p>
                <p style={{ color: '#F8FAFC', margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {signal.analysis}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => shareSignal(signal, 'telegram')}
                  style={{
                    background: '#0088CC',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  📱 Telegram
                </button>
                <button
                  onClick={() => shareSignal(signal, 'whatsapp')}
                  style={{
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={() => shareSignal(signal, 'email')}
                  style={{
                    background: '#6B7280',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  ✉️ Email
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderGems = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#58DAB3', marginBottom: '1.5rem', fontSize: '1.5rem' }}>💎 Gems Descobertas</h2>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {mockGems.map(gem => (
          <div key={gem.id} style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #475569',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: '#F8FAFC', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                  {gem.name} ({gem.symbol})
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: '#FCD34D' }}>
                    {'⭐'.repeat(gem.rating)}
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                    {gem.category}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#58DAB3', margin: '0 0 0.25rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
                  {gem.price}
                </p>
                <p style={{ color: '#4ADE80', margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>
                  {gem.potential}
                </p>
              </div>
            </div>

            <p style={{ color: '#F8FAFC', margin: '0 0 1rem 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {gem.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              <div>
                <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Risco</p>
                <p style={{ 
                  color: gem.risk === 'Alto' ? '#F87171' : gem.risk === 'Médio' ? '#FCD34D' : '#4ADE80', 
                  margin: 0, 
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {gem.risk}
                </p>
              </div>
              <div>
                <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Timeframe</p>
                <p style={{ color: '#F8FAFC', margin: 0, fontSize: '0.875rem' }}>{gem.timeframe}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNews = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#58DAB3', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📰 Monitoramento de Notícias</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {mockNews.map(news => (
          <div key={news.id} style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #475569',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ color: '#F8FAFC', margin: 0, fontSize: '1.125rem', lineHeight: '1.4', flex: 1 }}>
                {news.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem' }}>
                <div style={{
                  background: news.impact === 'BULLISH' ? '#10B981' : news.impact === 'BEARISH' ? '#EF4444' : '#6B7280',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {news.impact}
                </div>
                <div style={{
                  background: '#58DAB3',
                  color: '#0F172A',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {news.score}/10
                </div>
              </div>
            </div>
            
            <p style={{ color: '#94A3B8', margin: '0 0 0.75rem 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {news.description}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#58DAB3', fontSize: '0.75rem', fontWeight: '500' }}>
                {news.source}
              </span>
              <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                {news.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAutoTrading = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#58DAB3', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🤖 Auto Trading</h2>
      
      {/* Status do Bot */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#58DAB3', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>🎛️ Painel de Controle</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Status do Bot
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#4ADE80'
              }}></div>
              <span style={{ color: '#4ADE80', fontSize: '0.875rem', fontWeight: '600' }}>ATIVO</span>
            </div>
          </div>
          
          <div>
            <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Valor Máximo por Operação
            </label>
            <input
              type="number"
              defaultValue="100"
              style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#F8FAFC',
                padding: '0.5rem',
                fontSize: '0.875rem',
                width: '100px'
              }}
            />
            <span style={{ color: '#94A3B8', fontSize: '0.75rem', marginLeft: '0.5rem' }}>USDT</span>
          </div>
          
          <div>
            <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              % do Saldo por Trade
            </label>
            <input
              type="range"
              min="1"
              max="10"
              defaultValue="2"
              style={{ width: '100%', marginBottom: '0.25rem' }}
            />
            <span style={{ color: '#58DAB3', fontSize: '0.75rem' }}>2%</span>
          </div>
          
          <div>
            <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Análise Automática
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#58DAB3' }} />
              <span style={{ color: '#4ADE80', fontSize: '0.875rem' }}>✅ Validar sinais antes de executar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grupos Telegram */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#58DAB3', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>📱 Grupos Telegram Conectados</h3>
        
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { name: 'NexoCrypto Bot', status: 'Conectado', signals: 0, color: '#4ADE80', type: 'bot' },
            { name: 'Aguardando grupos...', status: 'Pronto para conectar', signals: 0, color: '#58DAB3', type: 'waiting' }
          ].map((group, index) => (
            <div key={index} style={{
              background: '#0F172A',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: group.color
                }}></div>
                <span style={{ color: '#F8FAFC', fontSize: '0.875rem', fontWeight: '500' }}>
                  {group.type === 'bot' ? '🤖 ' : '📱 '}{group.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                  {group.type === 'bot' ? 'Bot ativo' : 'Adicione grupos'}
                </span>
                <span style={{
                  color: group.color,
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {group.status}
                </span>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => {
              alert('🤖 Para adicionar grupos:\n\n1. Adicione @nexocrypto_trading_bot aos seus grupos de sinais\n2. Dê permissão de administrador ao bot\n3. Os grupos aparecerão automaticamente aqui\n\nBot Token: 8287801389:AAGwcmDKhBLh1bJvGHFvKDiRBpxgnw23Kik')
            }}
            style={{
            background: 'linear-gradient(135deg, #58DAB3 0%, #4ADE80 100%)',
            color: '#0F172A',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            + Adicionar Grupo
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#58DAB3', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>📊 Estatísticas em Tempo Real</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Sinais Recebidos</p>
            <p style={{ color: '#F8FAFC', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>23</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Executados</p>
            <p style={{ color: '#4ADE80', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>18</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Rejeitados</p>
            <p style={{ color: '#F87171', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>5</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Taxa de Sucesso</p>
            <p style={{ color: '#58DAB3', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>83%</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Precisão IA</p>
            <p style={{ color: '#58DAB3', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>91%</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Saldo ByBit</p>
            <p style={{ color: '#F8FAFC', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>2,450</p>
            <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.75rem' }}>USDT</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>P&L Hoje</p>
            <p style={{ color: '#4ADE80', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>+45.30</p>
            <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.75rem' }}>USDT</p>
          </div>
        </div>
      </div>

      {/* Últimas Operações */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#58DAB3', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>📈 Últimas Operações</h3>
        
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { pair: 'BTCUSDT', type: 'LONG', result: '+2.3%', source: 'Binance Killers', color: '#4ADE80' },
            { pair: 'ETHUSDT', type: 'SHORT', result: '-1.1%', source: 'ByBit Pro', color: '#F87171' },
            { pair: 'SOLUSDT', type: 'LONG', result: 'Em andamento', source: 'Binance Killers', color: '#FCD34D' }
          ].map((trade, index) => (
            <div key={index} style={{
              background: '#0F172A',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#F8FAFC', fontSize: '0.875rem', fontWeight: '600' }}>
                  {trade.pair}
                </span>
                <span style={{
                  background: trade.type === 'LONG' ? '#10B981' : '#EF4444',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {trade.type}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                  {trade.source}
                </span>
                <span style={{
                  color: trade.color,
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {trade.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configurações Avançadas */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#58DAB3', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>⚙️ Configurações Avançadas</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Stop Loss Automático
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#58DAB3' }} />
              <span style={{ color: '#4ADE80', fontSize: '0.875rem' }}>✅ Para todos os trades</span>
            </div>
          </div>
          
          <div>
            <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Take Profit Parcial
            </label>
            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>50% TP1, 30% TP2, 20% TP3</span>
          </div>
          
          <div>
            <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Max Drawdown
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                defaultValue="5"
                style={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#F8FAFC',
                  padding: '0.25rem',
                  fontSize: '0.75rem',
                  width: '60px'
                }}
              />
              <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>% (pausar bot)</span>
            </div>
          </div>
          
          <div>
            <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Confiança Mínima
            </label>
            <input
              type="range"
              min="50"
              max="95"
              defaultValue="75"
              style={{ width: '100%', marginBottom: '0.25rem' }}
            />
            <span style={{ color: '#58DAB3', fontSize: '0.75rem' }}>75%</span>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
            Pares Permitidos
          </label>
          <select style={{
            background: '#0F172A',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#F8FAFC',
            padding: '0.5rem',
            fontSize: '0.875rem',
            width: '100%',
            maxWidth: '300px'
          }}>
            <option value="all">Todos os Pares (353+ pares - Recomendado)</option>
            <optgroup label="🔥 Principais (10)">
              <option value="BTCUSDT">BTC/USDT</option>
              <option value="ETHUSDT">ETH/USDT</option>
              <option value="SOLUSDT">SOL/USDT</option>
              <option value="XRPUSDT">XRP/USDT</option>
              <option value="ADAUSDT">ADA/USDT</option>
            </optgroup>
            <optgroup label="💎 Top 50 Altcoins (20)">
              <option value="LTCUSDT">LTC/USDT</option>
              <option value="BCHUSDT">BCH/USDT</option>
              <option value="ATOMUSDT">ATOM/USDT</option>
              <option value="FILUSDT">FIL/USDT</option>
            </optgroup>
            <optgroup label="🚀 DeFi & Yield (15)">
              <option value="AAVEUSDT">AAVE/USDT</option>
              <option value="COMPUSDT">COMP/USDT</option>
              <option value="SUSHIUSDT">SUSHI/USDT</option>
              <option value="CRVUSDT">CRV/USDT</option>
            </optgroup>
          </select>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <label style={{ color: '#F8FAFC', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
            Horário de Operação
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="time"
              defaultValue="09:00"
              style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#F8FAFC',
                padding: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
            <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>às</span>
            <input
              type="time"
              defaultValue="18:00"
              style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#F8FAFC',
                padding: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
            <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>(Brasília)</span>
          </div>
        </div>
      </div>

      {/* Validação Telegram */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#58DAB3', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>🔐 Validação de Telegram</h3>
        
        <div style={{
          background: '#0F172A',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #334155',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#F8FAFC', fontSize: '0.875rem', fontWeight: '500' }}>
              UUID de Validação
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: '#4ADE80',
                color: '#065F46',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                ✅ VALIDADO
              </span>
              <button 
                onClick={disconnectTelegram}
                style={{
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#DC2626'}
                onMouseOut={(e) => e.target.style.background = '#EF4444'}
              >
                🔌 Desconectar
              </button>
            </div>
          </div>
          
          <div style={{
            background: '#374151',
            padding: '0.75rem',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#F8FAFC',
            marginBottom: '0.75rem'
          }}>
            {currentUUID || 'Gerando UUID...'}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{
              background: '#58DAB3',
              color: '#0F172A',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              📋 Copiar UUID
            </button>
            <button 
              onClick={generateNewUUID}
              style={{
              background: '#10B981',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              🔄 Gerar Novo / Desconectar
            </button>
          </div>
        </div>
        
        {currentUUID && (
          <div style={{
            background: '#065F46',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #10B981'
          }}>
            <h4 style={{ color: '#D1FAE5', margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
              ✅ Telegram Conectado com Sucesso!
            </h4>
            <p style={{ color: '#D1FAE5', fontSize: '0.75rem', margin: 0 }}>
              Seu Telegram foi validado e está pronto para receber sinais.<br/>
              {telegramUsername && <><strong>Username:</strong> @{telegramUsername}<br/></>}
              Bot: <strong>@nexocrypto_trading_bot</strong> | Status: <strong>ATIVO</strong>
            </p>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button style={{
          background: 'linear-gradient(135deg, #58DAB3 0%, #4ADE80 100%)',
          color: '#0F172A',
          border: 'none',
          padding: '0.875rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          💾 Salvar Configurações
        </button>
        
        <button style={{
          background: '#1E40AF',
          color: 'white',
          border: 'none',
          padding: '0.875rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          🔗 Testar Conexão ByBit
        </button>
        
        <button style={{
          background: '#6B7280',
          color: 'white',
          border: 'none',
          padding: '0.875rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          🔑 Configurar API Keys
        </button>
      </div>
    </div>
  )

  const renderCopyTrading = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#58DAB3', marginBottom: '1.5rem', fontSize: '1.5rem' }}>👥 Copy Trading</h2>
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '3rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
        <h3 style={{ color: '#F8FAFC', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Em Desenvolvimento</h3>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>
          Sistema de Copy Trading será implementado em breve.<br/>
          Permitirá copiar automaticamente trades de traders experientes.
        </p>
      </div>
    </div>
  )

  const renderCourses = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#58DAB3', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🎓 Cursos</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {[
          {
            title: "Análise Técnica Fundamentals",
            description: "Aprenda os conceitos básicos de análise técnica, suportes, resistências e indicadores.",
            modules: 12,
            duration: "8 horas",
            level: "Iniciante",
            color: "#4ADE80"
          },
          {
            title: "Gestão de Risco Avançada",
            description: "Domine as técnicas de gestão de risco e proteção de capital no trading.",
            modules: 8,
            duration: "6 horas", 
            level: "Intermediário",
            color: "#FCD34D"
          },
          {
            title: "Estratégias Avançadas",
            description: "Estratégias profissionais utilizadas por traders institucionais.",
            modules: 15,
            duration: "12 horas",
            level: "Avançado", 
            color: "#F87171"
          }
        ].map((course, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #475569',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#F8FAFC', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                {course.title}
              </h3>
              <div style={{
                background: course.color,
                color: course.level === 'Avançado' ? 'white' : '#0F172A',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {course.level}
              </div>
            </div>
            
            <p style={{ color: '#94A3B8', margin: '0 0 1rem 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {course.description}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Módulos</p>
                <p style={{ color: '#F8FAFC', margin: 0, fontSize: '1rem', fontWeight: '600' }}>{course.modules}</p>
              </div>
              <div>
                <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.75rem' }}>Duração</p>
                <p style={{ color: '#F8FAFC', margin: 0, fontSize: '1rem', fontWeight: '600' }}>{course.duration}</p>
              </div>
            </div>
            
            <button style={{
              background: '#374151',
              color: '#94A3B8',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'not-allowed',
              width: '100%'
            }}>
              🚧 Em Desenvolvimento
            </button>
          </div>
        ))}
      </div>
      
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
        <h3 style={{ color: '#F8FAFC', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Plataforma de Ensino</h3>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>
          Nossa plataforma de cursos será lançada em breve com conteúdo exclusivo<br/>
          desenvolvido por traders profissionais e analistas certificados.
        </p>
      </div>
    </div>
  )
}

  // Renderização principal
  if (!isAuthenticated) {
    if (showRegister) {
      return renderRegister()
    }
    return renderLogin()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '1rem 2rem',
        borderBottom: '1px solid #475569',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              color: '#58DAB3',
              margin: '0 0 0.25rem 0',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              NexoCrypto
            </h1>
            <p style={{
              color: '#94A3B8',
              margin: 0,
              fontSize: '0.875rem'
            }}>
              Sistema Avançado de Trading & Análise
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4ADE80'
              }}></div>
              <span style={{ color: '#4ADE80', fontSize: '0.875rem', fontWeight: '500' }}>
                Sistema Online
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              style={{
                background: '#EF4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🚪 Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: '#1E293B',
        padding: '1rem 2rem',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'signals', label: '📈 Sinais', icon: '📈' },
            { id: 'gems', label: '💎 Gems', icon: '💎' },
            { id: 'news', label: '📰 Notícias', icon: '📰' },
            { id: 'autotrading', label: '🤖 Auto Trading', icon: '🤖' },
            { id: 'copytrading', label: '👥 Copy Trading', icon: '👥' },
            { id: 'courses', label: '🎓 Cursos', icon: '🎓' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #58DAB3 0%, #4ADE80 100%)' 
                  : 'transparent',
                color: activeTab === tab.id ? '#0F172A' : '#94A3B8',
                border: activeTab === tab.id ? 'none' : '1px solid #334155',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = '#334155'
                  e.target.style.color = '#F8FAFC'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'transparent'
                  e.target.style.color = '#94A3B8'
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'signals' && renderSignals()}
        {activeTab === 'gems' && renderGems()}
        {activeTab === 'news' && renderNews()}
        {activeTab === 'autotrading' && renderAutoTrading()}
        {activeTab === 'copytrading' && renderCopyTrading()}
        {activeTab === 'courses' && renderCourses()}
      </main>
    </div>
  )
}

export default App

