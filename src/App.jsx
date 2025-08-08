import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  
  // Estados para Auto Trading
  const [currentUUID, setCurrentUUID] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [isValidated, setIsValidated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  
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
  
  // Estados para dados das abas
  const [signals, setSignals] = useState([])
  const [gems, setGems] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)

  // Verificar se já está logado
  useEffect(() => {
    const token = localStorage.getItem('nexocrypto_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  // Efeito para gerar UUID quando autenticado
  useEffect(() => {
    if (isAuthenticated && !currentUUID) {
      generateNewUUID()
    }
  }, [isAuthenticated])

  // Função para gerar novo UUID
  const generateNewUUID = async () => {
    try {
      const response = await fetch('https://nexocrypto-backend.onrender.com/api/generate-uuid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (data.uuid) {
        setCurrentUUID(data.uuid)
        setIsValidated(false)
        setTelegramUsername('')
      }
    } catch (error) {
      console.error('Erro ao gerar UUID:', error)
    }
  }

  // Função para verificar validação do Telegram
  const checkTelegramValidation = async () => {
    if (!currentUUID) return
    
    try {
      const response = await fetch(`https://nexocrypto-backend.onrender.com/api/check-validation/${currentUUID}`)
      const data = await response.json()
      
      if (data.validated) {
        setIsValidated(true)
        setTelegramUsername(data.username || 'Usuário validado')
      }
    } catch (error) {
      console.error('Erro ao verificar validação:', error)
    }
  }

  // Funções de autenticação avançada
  const handleRegister = (e) => {
    e.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Senhas não coincidem!')
      return
    }
    setVerificationStep('email')
    alert('Código de verificação enviado para seu e-mail!')
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    alert('Link de recuperação enviado para seu e-mail!')
    setShowForgotPassword(false)
  }

  const handleGoogleLogin = () => {
    alert('Redirecionando para login com Google...')
  }

  const handleVerification = (type) => {
    if (type === 'email') {
      setVerificationStep('sms')
      alert('Código SMS enviado!')
    } else {
      alert('Conta criada com sucesso!')
      setShowRegister(false)
      setVerificationStep('')
    }
  }

  // Dados mock para as abas
  const mockSignals = [
    {
      id: 1,
      symbol: 'BTC/USDT',
      type: 'LONG',
      entry: '67,850.00',
      currentPrice: '68,200.00',
      targets: ['68,500', '69,000', '69,500'],
      stopLoss: '67,200',
      confidence: 85,
      date: '08/08/2025',
      time: '14:30',
      status: 'Ativo'
    },
    {
      id: 2,
      symbol: 'ETH/USDT',
      type: 'SHORT',
      entry: '2,650.00',
      currentPrice: '2,620.00',
      targets: ['2,600', '2,550', '2,500'],
      stopLoss: '2,700',
      confidence: 78,
      date: '08/08/2025',
      time: '13:15',
      status: 'Ativo'
    },
    {
      id: 3,
      symbol: 'SOL/USDT',
      type: 'LONG',
      entry: '185.50',
      currentPrice: '188.20',
      targets: ['190', '195', '200'],
      stopLoss: '180',
      confidence: 92,
      date: '08/08/2025',
      time: '12:45',
      status: 'Lucro'
    }
  ]

  const mockGems = [
    {
      id: 1,
      name: 'LayerZero (ZRO)',
      symbol: 'ZRO',
      rating: 5,
      price: '$3.45',
      change: '+12.5%',
      marketCap: '$1.2B',
      category: 'Interoperability',
      description: 'Protocolo de interoperabilidade omnichain revolucionário',
      buyPlatform: 'Binance, Bybit',
      wallet: 'MetaMask',
      buyWith: 'USDT, ETH',
      analysis: 'Projeto com tecnologia inovadora e parcerias sólidas. Potencial de crescimento exponencial.'
    },
    {
      id: 2,
      name: 'Arbitrum (ARB)',
      symbol: 'ARB',
      rating: 4,
      price: '$0.85',
      change: '+8.3%',
      marketCap: '$2.8B',
      category: 'Layer 2',
      description: 'Solução de escalabilidade para Ethereum',
      buyPlatform: 'Binance, Coinbase',
      wallet: 'MetaMask, Trust Wallet',
      buyWith: 'USDT, ETH',
      analysis: 'Líder em soluções Layer 2, crescimento sustentável esperado.'
    },
    {
      id: 3,
      name: 'Celestia (TIA)',
      symbol: 'TIA',
      rating: 5,
      price: '$8.90',
      change: '+15.7%',
      marketCap: '$1.5B',
      category: 'Modular Blockchain',
      description: 'Primeira blockchain modular para disponibilidade de dados',
      buyPlatform: 'Binance, OKX',
      wallet: 'Keplr, MetaMask',
      buyWith: 'USDT, ATOM',
      analysis: 'Tecnologia disruptiva com potencial de redefinir a arquitetura blockchain.'
    }
  ]

  const mockNews = [
    {
      id: 1,
      title: 'Bitcoin atinge novo recorde histórico de $68,500',
      summary: 'BTC quebra resistência importante e analistas preveem continuação da alta',
      source: 'CoinDesk',
      date: '08/08/2025',
      time: '15:30',
      category: 'Market',
      impact: 'High'
    },
    {
      id: 2,
      title: 'Ethereum 2.0 completa upgrade com sucesso',
      summary: 'Rede Ethereum implementa melhorias de escalabilidade e eficiência energética',
      source: 'CoinTelegraph',
      date: '08/08/2025',
      time: '14:15',
      category: 'Technology',
      impact: 'High'
    },
    {
      id: 3,
      title: 'Regulamentação cripto avança no Brasil',
      summary: 'Banco Central anuncia novas diretrizes para exchanges e stablecoins',
      source: 'InfoMoney',
      date: '08/08/2025',
      time: '13:00',
      category: 'Regulation',
      impact: 'Medium'
    }
  ]

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

  // Página de Login
  if (!isAuthenticated) {
    // Tela de Cadastro
    if (showRegister) {
      if (verificationStep === 'email') {
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
              background: 'rgba(30, 41, 59, 0.8)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              backdropFilter: 'blur(10px)',
              width: '100%',
              maxWidth: '400px'
            }}>
              <h2 style={{ color: '#10B981', textAlign: 'center', marginBottom: '1rem' }}>
                Verificação E-mail
              </h2>
              <p style={{ color: '#94A3B8', textAlign: 'center', marginBottom: '2rem' }}>
                Digite o código enviado para seu e-mail
              </p>
              <input
                type="text"
                value={verificationCodes.email}
                onChange={(e) => setVerificationCodes({...verificationCodes, email: e.target.value})}
                placeholder="Código de 6 dígitos"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #10B981',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
              />
              <button
                onClick={() => handleVerification('email')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: '#10B981',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Verificar E-mail
              </button>
              <button
                onClick={() => setShowRegister(false)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #EF4444',
                  background: 'transparent',
                  color: '#EF4444',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )
      }

      if (verificationStep === 'sms') {
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
              background: 'rgba(30, 41, 59, 0.8)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              backdropFilter: 'blur(10px)',
              width: '100%',
              maxWidth: '400px'
            }}>
              <h2 style={{ color: '#F59E0B', textAlign: 'center', marginBottom: '1rem' }}>
                Verificação SMS
              </h2>
              <p style={{ color: '#94A3B8', textAlign: 'center', marginBottom: '2rem' }}>
                Digite o código SMS enviado para seu telefone
              </p>
              <input
                type="text"
                value={verificationCodes.sms}
                onChange={(e) => setVerificationCodes({...verificationCodes, sms: e.target.value})}
                placeholder="Código de 6 dígitos"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #F59E0B',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
              />
              <button
                onClick={() => handleVerification('sms')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: '#F59E0B',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Finalizar Cadastro
              </button>
              <button
                onClick={() => setShowRegister(false)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #EF4444',
                  background: 'transparent',
                  color: '#EF4444',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )
      }

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
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h2 style={{ color: '#3B82F6', textAlign: 'center', marginBottom: '1rem' }}>
              Cadastro
            </h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nome completo"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #3B82F6',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #3B82F6',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
                required
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #3B82F6',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #3B82F6',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
                required
              />
              <input
                type="password"
                placeholder="Confirmar senha"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #3B82F6',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
                required
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: '#3B82F6',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Cadastrar
              </button>
            </form>
            <button
              onClick={() => setShowRegister(false)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #EF4444',
                background: 'transparent',
                color: '#EF4444',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      )
    }

    // Tela de Esqueci minha senha
    if (showForgotPassword) {
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
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h2 style={{ color: '#F59E0B', textAlign: 'center', marginBottom: '1rem' }}>
              Recuperar Senha
            </h2>
            <p style={{ color: '#94A3B8', textAlign: 'center', marginBottom: '2rem' }}>
              Digite seu e-mail para receber o link de recuperação
            </p>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Seu e-mail"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #F59E0B',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
                required
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: '#F59E0B',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Enviar Link
              </button>
            </form>
            <button
              onClick={() => setShowForgotPassword(false)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #EF4444',
                background: 'transparent',
                color: '#EF4444',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      )
    }

    // Tela de Login Principal
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
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ color: '#10B981', textAlign: 'center', marginBottom: '0.5rem' }}>
            NexoCrypto
          </h1>
          <p style={{ color: '#94A3B8', textAlign: 'center', marginBottom: '2rem' }}>
            Sistema Avançado de Trading
          </p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#10B981', display: 'block', marginBottom: '0.5rem' }}>
                Usuário
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #10B981',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#F59E0B', display: 'block', marginBottom: '0.5rem' }}>
                Senha
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #F59E0B',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            {loginError && (
              <div style={{ color: '#EF4444', marginBottom: '1rem', textAlign: 'center' }}>
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: '#10B981',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              Entrar
            </button>
          </form>

          {/* Botões de autenticação avançada */}
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #DB4437',
                background: 'transparent',
                color: '#DB4437',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              🔍 Entrar com Google
            </button>
            
            <button
              onClick={() => setShowRegister(true)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #3B82F6',
                background: 'transparent',
                color: '#3B82F6',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              📝 Cadastrar
            </button>
            
            <button
              onClick={() => setShowForgotPassword(true)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #F59E0B',
                background: 'transparent',
                color: '#F59E0B',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔑 Esqueci minha senha
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard com Auto Trading
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ color: '#10B981', margin: 0 }}>
          Dashboard NexoCrypto
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem('nexocrypto_token')
            setIsAuthenticated(false)
          }}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#EF4444',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'dashboard', label: '🏠 Dashboard', color: '#10B981' },
          { id: 'signals', label: '📊 Sinais', color: '#3B82F6' },
          { id: 'gems', label: '💎 Gems', color: '#F59E0B' },
          { id: 'news', label: '📰 Notícias', color: '#EF4444' },
          { id: 'autotrading', label: '🤖 Auto Trading', color: '#8B5CF6' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
              background: activeTab === tab.id ? `${tab.color}20` : 'rgba(30, 41, 59, 0.8)',
              color: activeTab === tab.id ? tab.color : '#94A3B8',
              fontSize: '1rem',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#10B981', marginBottom: '1.5rem' }}>
            🏠 Dashboard Principal
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10B981',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#10B981', margin: '0 0 0.5rem 0' }}>Sinais Ativos</h3>
              <p style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>3</p>
            </div>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid #3B82F6',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#3B82F6', margin: '0 0 0.5rem 0' }}>Gems Descobertas</h3>
              <p style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>3</p>
            </div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '2px solid #F59E0B',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#F59E0B', margin: '0 0 0.5rem 0' }}>Notícias Hoje</h3>
              <p style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>3</p>
            </div>
            <div style={{
              background: isValidated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `2px solid ${isValidated ? '#10B981' : '#EF4444'}`,
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: isValidated ? '#10B981' : '#EF4444', margin: '0 0 0.5rem 0' }}>Auto Trading</h3>
              <p style={{ color: '#F1F5F9', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                {isValidated ? '✅ ATIVO' : '❌ INATIVO'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'autotrading' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#8B5CF6', marginBottom: '1.5rem' }}>
            🤖 Auto Trading
          </h2>
        
        {/* UUID Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#F59E0B', marginBottom: '1rem' }}>
            Validação Telegram
          </h3>
          
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '2px solid #10B981',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0' }}>
              UUID Atual:
            </p>
            <p style={{ 
              color: '#F1F5F9', 
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              margin: 0,
              wordBreak: 'break-all'
            }}>
              {currentUUID || 'Gerando...'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button
              onClick={generateNewUUID}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: '#10B981',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Gerar Novo UUID
            </button>
            
            <button
              onClick={checkTelegramValidation}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: '#3B82F6',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Verificar Validação
            </button>
          </div>

          {/* Status da Validação */}
          <div style={{
            background: isValidated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `2px solid ${isValidated ? '#10B981' : '#EF4444'}`,
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: isValidated ? '#10B981' : '#EF4444',
              margin: 0,
              fontWeight: 'bold'
            }}>
              {isValidated ? '✅ VALIDADO' : '❌ NÃO VALIDADO'}
            </p>
            {isValidated && telegramUsername && (
              <p style={{ color: '#94A3B8', margin: '0.5rem 0 0 0' }}>
                Usuário: {telegramUsername}
              </p>
            )}
          </div>
        </div>

        {/* Instruções */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '2px solid #3B82F6',
          padding: '1rem',
          borderRadius: '0.5rem'
        }}>
          <h4 style={{ color: '#3B82F6', margin: '0 0 0.5rem 0' }}>
            📋 Como validar:
          </h4>
          <ol style={{ color: '#94A3B8', margin: 0, paddingLeft: '1.5rem' }}>
            <li>Copie o UUID acima</li>
            <li>Acesse o bot: @nexocrypto_trading_bot</li>
            <li>Digite: /validate [UUID]</li>
            <li>Clique em "Verificar Validação"</li>
          </ol>
        </div>
        </div>
      )}

      {/* Aba Sinais */}
      {activeTab === 'signals' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#3B82F6', marginBottom: '1.5rem' }}>
            📊 Sinais de Trading
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {mockSignals.map(signal => (
              <div key={signal.id} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: `2px solid ${signal.type === 'LONG' ? '#10B981' : '#EF4444'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#F1F5F9', margin: 0 }}>{signal.symbol}</h3>
                  <span style={{
                    background: signal.type === 'LONG' ? '#10B981' : '#EF4444',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {signal.type}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Entrada:</p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontWeight: 'bold' }}>${signal.entry}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Preço Atual:</p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontWeight: 'bold' }}>${signal.currentPrice}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Stop Loss:</p>
                    <p style={{ color: '#EF4444', margin: 0, fontWeight: 'bold' }}>${signal.stopLoss}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Confiança:</p>
                    <p style={{ color: '#10B981', margin: 0, fontWeight: 'bold' }}>{signal.confidence}%</p>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Targets:</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {signal.targets.map((target, index) => (
                      <span key={index} style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10B981',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}>
                        ${target}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                    {signal.date} às {signal.time}
                  </span>
                  <span style={{
                    background: signal.status === 'Lucro' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: signal.status === 'Lucro' ? '#10B981' : '#3B82F6',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem'
                  }}>
                    {signal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba Gems */}
      {activeTab === 'gems' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#F59E0B', marginBottom: '1.5rem' }}>
            💎 Gems Descobertas
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {mockGems.map(gem => (
              <div key={gem.id} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '2px solid #F59E0B'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#F1F5F9', margin: 0 }}>{gem.name}</h3>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < gem.rating ? '#F59E0B' : '#374151', fontSize: '1.25rem' }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Preço:</p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontWeight: 'bold' }}>{gem.price}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Variação:</p>
                    <p style={{ color: '#10B981', margin: 0, fontWeight: 'bold' }}>{gem.change}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Market Cap:</p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontWeight: 'bold' }}>{gem.marketCap}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Categoria:</p>
                    <p style={{ color: '#3B82F6', margin: 0, fontWeight: 'bold' }}>{gem.category}</p>
                  </div>
                </div>
                <p style={{ color: '#94A3B8', margin: '0 0 1rem 0' }}>{gem.description}</p>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Como comprar:</p>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #3B82F6' }}>
                    <p style={{ color: '#F1F5F9', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                      <strong>Plataforma:</strong> {gem.buyPlatform}
                    </p>
                    <p style={{ color: '#F1F5F9', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                      <strong>Carteira:</strong> {gem.wallet}
                    </p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontSize: '0.875rem' }}>
                      <strong>Comprar com:</strong> {gem.buyWith}
                    </p>
                  </div>
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #F59E0B' }}>
                  <p style={{ color: '#F59E0B', margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 'bold' }}>Análise:</p>
                  <p style={{ color: '#F1F5F9', margin: 0, fontSize: '0.875rem' }}>{gem.analysis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba News */}
      {activeTab === 'news' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#EF4444', marginBottom: '1.5rem' }}>
            📰 Notícias Crypto
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {mockNews.map(article => (
              <div key={article.id} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '2px solid #EF4444'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#F1F5F9', margin: 0, flex: 1 }}>{article.title}</h3>
                  <span style={{
                    background: article.impact === 'High' ? '#EF4444' : '#F59E0B',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginLeft: '1rem'
                  }}>
                    {article.impact}
                  </span>
                </div>
                <p style={{ color: '#94A3B8', margin: '0 0 1rem 0' }}>{article.summary}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: '#3B82F6', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {article.source}
                    </span>
                    <span style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#3B82F6',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      {article.category}
                    </span>
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                    {article.date} às {article.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App

