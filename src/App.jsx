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
  const [telegramValidationStatus, setTelegramValidationStatus] = useState('NÃO VALIDADO')
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
  
  // Estados para grupos Telegram
  const [telegramGroups, setTelegramGroups] = useState([])
  const [telegramValidated, setTelegramValidated] = useState(false)
  
  // Estados para autorização userbot
  const [userbotAuthStep, setUserbotAuthStep] = useState('idle') // idle, phone, code, authorized
  const [userbotPhone, setUserbotPhone] = useState('')
  const [userbotCode, setUserbotCode] = useState('')
  const [userbotSessionId, setUserbotSessionId] = useState('')

  // Estados para seleção de grupos
  const [showGroupSelection, setShowGroupSelection] = useState(false)
  const [availableGroups, setAvailableGroups] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [loadingGroups, setLoadingGroups] = useState(false)

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
      // Primeiro tenta recuperar UUID salvo
      const savedUUID = localStorage.getItem('nexocrypto_current_uuid')
      if (savedUUID) {
        setCurrentUUID(savedUUID)
        console.log('UUID recuperado do localStorage:', savedUUID)
      } else {
        generateNewUUID()
      }
    }
  }, [isAuthenticated])

  // Efeito para verificar validação quando UUID é definido
  useEffect(() => {
    if (currentUUID) {
      // Recupera estado de validação do localStorage
      const savedValidationStatus = localStorage.getItem(`telegram_validation_${currentUUID}`)
      const savedUsername = localStorage.getItem(`telegram_username_${currentUUID}`)
      
      if (savedValidationStatus === 'VALIDADO') {
        setIsValidated(true)
        setTelegramValidated(true)
        setTelegramValidationStatus('VALIDADO')
        setTelegramUsername(savedUsername || 'Usuário Telegram')
        console.log('Estado de validação recuperado do localStorage')
        
        // Carrega grupos automaticamente
        loadTelegramGroups()
      } else {
        // Verifica validação no backend
        checkTelegramValidation()
      }
    }
  }, [currentUUID])

  // Função para gerar novo UUID
  const generateNewUUID = async () => {
    try {
      const response = await fetch('https://nexocrypto-backend.onrender.com/api/telegram/generate-uuid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentUUID(data.uuid)
        setIsValidated(false)
        setTelegramUsername('')
        
        // Salva UUID no localStorage
        localStorage.setItem('nexocrypto_current_uuid', data.uuid)
        
        console.log('Novo UUID gerado:', data.uuid)
      } else {
        console.error('Erro ao gerar UUID:', data.error)
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    }
  }

  // Função para verificar validação do Telegram
  const checkTelegramValidation = async () => {
    if (!currentUUID) {
      console.log('Nenhum UUID para verificar')
      return
    }

    try {
      const response = await fetch(`https://nexocrypto-backend.onrender.com/api/telegram/check-validation/${currentUUID}`)
      const data = await response.json()
      
      if (data.success && data.validated) {
        setIsValidated(true)
        setTelegramValidated(true)
        setTelegramValidationStatus('VALIDADO')
        setTelegramUsername(data.username || 'Usuário Telegram')
        
        // Salva estado no localStorage
        localStorage.setItem(`telegram_validation_${currentUUID}`, 'VALIDADO')
        localStorage.setItem(`telegram_username_${currentUUID}`, data.username || 'Usuário Telegram')
        
        console.log('Validação confirmada para:', data.username)
        
        // Carrega grupos automaticamente após validação
        loadTelegramGroups()
      } else {
        setIsValidated(false)
        setTelegramValidated(false)
        setTelegramValidationStatus('NÃO VALIDADO')
        setTelegramUsername('')
        setTelegramGroups([])
        
        // Remove do localStorage se não validado
        localStorage.removeItem(`telegram_validation_${currentUUID}`)
        localStorage.removeItem(`telegram_username_${currentUUID}`)
        
        console.log('UUID não validado ainda')
      }
    } catch (error) {
      console.error('Erro ao verificar validação:', error)
    }
  }

  // Função para carregar grupos Telegram
  const loadTelegramGroups = async () => {
    if (!currentUUID) {
      console.log('Nenhum UUID para carregar grupos')
      return
    }

    try {
      const response = await fetch(`https://nexocrypto-backend.onrender.com/api/telegram/user-groups/${currentUUID}`)
      const data = await response.json()
      
      if (data.success) {
        // Adiciona indicador DEMO nos grupos padrão
        const groupsWithDemo = (data.groups || []).map(group => ({
          ...group,
          isDemo: group.source !== 'userbot_real' // Marca como demo se NÃO for userbot_real
        }))
        setTelegramGroups(groupsWithDemo)
        console.log('Grupos carregados:', groupsWithDemo?.length || 0)
        console.log('Grupos reais encontrados:', groupsWithDemo.filter(g => !g.isDemo).length)
      } else {
        console.error('Erro ao carregar grupos:', data.error)
        setTelegramGroups([])
      }
    } catch (error) {
      console.error('Erro ao carregar grupos:', error)
      setTelegramGroups([])
    }
  }

  // Função para ativar/desativar monitoramento de grupo
  const toggleGroupMonitoring = async (groupId, isMonitored) => {
    if (!currentUUID) {
      alert('Nenhuma conexão ativa')
      return
    }

    try {
      const response = await fetch('https://nexocrypto-backend.onrender.com/api/telegram/toggle-group-monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: currentUUID,
          group_id: groupId,
          is_monitored: isMonitored
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Atualiza estado local
        setTelegramGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === groupId 
              ? { ...group, is_monitored: isMonitored }
              : group
          )
        )
        
        console.log(`Grupo ${groupId} ${isMonitored ? 'ativado' : 'desativado'} para monitoramento`)
      } else {
        alert('Erro ao alterar monitoramento: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao alterar monitoramento:', error)
      alert('Erro ao alterar monitoramento do grupo')
    }
  }

   // Função para iniciar autorização do userbot
  const startUserbotAuth = () => {
    setUserbotAuthStep('phone')
    setUserbotPhone('')
    setUserbotCode('')
  }

  // Função para enviar telefone e solicitar código
  const sendPhoneForAuth = async () => {
    if (!userbotPhone.trim()) {
      alert('Digite seu número de telefone')
      return
    }

    try {
      const response = await fetch('https://nexocrypto-backend.onrender.com/api/telegram/start-userbot-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: currentUUID,
          phone_number: userbotPhone
        })
      })

      const data = await response.json()
      
      if (data.success) {
        if (data.status === 'code_sent') {
          setUserbotSessionId(data.session_id)
          setUserbotAuthStep('code')
          alert('Código de verificação enviado para seu telefone!')
        } else if (data.status === 'authorized') {
          setUserbotAuthStep('authorized')
          loadTelegramGroups() // Recarrega grupos com dados reais
          alert(`✅ Grupos reais capturados com sucesso!\n\n📊 ${data.groups_count} grupos encontrados para seu telefone.\n\nOs grupos reais agora aparecem no sistema sem o indicador DEMO.`)
        }
      } else {
        // Mostrar mensagem explicativa em caso de erro
        alert(`⚠️ Conexão com grupos reais temporariamente indisponível.\n\nMotivo: ${data.error}\n\nVocê pode continuar usando os grupos DEMO para testar o sistema. Estamos trabalhando para resolver este problema.`)
        setUserbotAuthStep('idle')
      }
    } catch (error) {
      console.error('Erro ao enviar telefone:', error)
      alert('⚠️ Não foi possível conectar aos grupos reais no momento.\n\nVocê pode continuar usando os grupos DEMO para testar todas as funcionalidades do sistema.')
      setUserbotAuthStep('idle')
    }
  }

  // Função para verificar código de autorização
  const verifyAuthCode = async () => {
    if (!userbotCode.trim()) {
      alert('Digite o código de verificação')
      return
    }

    try {
      const response = await fetch('https://nexocrypto-backend.onrender.com/api/telegram/verify-userbot-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: currentUUID,
          phone_number: userbotPhone,
          code: userbotCode
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setUserbotAuthStep('authorized')
        
        // Atualiza estado de validação
        setIsValidated(true)
        setTelegramValidated(true)
        setTelegramValidationStatus('VALIDADO')
        setTelegramUsername('Usuário Telegram')
        
        // Salva estado no localStorage
        localStorage.setItem(`telegram_validation_${currentUUID}`, 'VALIDADO')
        localStorage.setItem(`telegram_username_${currentUUID}`, 'Usuário Telegram')
        
        // Abre modal de seleção de grupos
        setUserbotAuthStep('authorized')
        await loadAvailableGroups()
        setShowGroupSelection(true)
        
      } else {
        alert(`⚠️ Erro na verificação: ${data.error}\n\nVocê pode continuar usando os grupos DEMO para testar o sistema.`)
      }
    } catch (error) {
      console.error('Erro ao verificar código:', error)
      alert('⚠️ Não foi possível verificar o código no momento.\n\nVocê pode continuar usando os grupos DEMO para testar todas as funcionalidades.')
    }
  }

  // Função para carregar grupos disponíveis
  const loadAvailableGroups = async () => {
    if (!currentUUID) return
    
    setLoadingGroups(true)
    try {
      const response = await fetch(`https://nexocrypto-backend.onrender.com/api/telegram/available-groups/${currentUUID}`)
      const data = await response.json()
      
      if (data.success) {
        setAvailableGroups(data.groups)
        setSelectedGroups([])
        console.log('Grupos disponíveis carregados:', data.groups.length)
      } else {
        alert('Erro ao carregar grupos: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar grupos:', error)
      alert('Erro ao carregar grupos disponíveis')
    } finally {
      setLoadingGroups(false)
    }
  }

  // Função para alternar seleção de grupo
  const toggleGroupSelection = (groupId) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId)
      } else if (prev.length < 5) {
        return [...prev, groupId]
      }
      return prev
    })
  }

  // Função para confirmar seleção de grupos
  const confirmGroupSelection = async () => {
    if (selectedGroups.length !== 5) {
      alert('Você deve selecionar exatamente 5 grupos')
      return
    }

    try {
      const response = await fetch('https://nexocrypto-backend.onrender.com/api/telegram/select-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: currentUUID,
          selected_groups: selectedGroups
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setShowGroupSelection(false)
        await loadTelegramGroups() // Recarrega grupos selecionados
        alert(`✅ Grupos selecionados com sucesso!\n\n📊 ${selectedGroups.length} grupos configurados para monitoramento.\n\nOs grupos selecionados agora aparecem com badge REAL.`)
      } else {
        alert('Erro ao salvar seleção: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao confirmar seleção:', error)
      alert('Erro ao salvar grupos selecionados')
    }
  }

  // Função para desconectar Telegramam
  const disconnectTelegram = async () => {
    if (!currentUUID) {
      alert('Nenhuma conexão ativa para desconectar')
      return
    }

    const confirmDisconnect = window.confirm(
      'Tem certeza que deseja desconectar do Telegram?\n\n' +
      'Isso irá:\n' +
      '• Desativar o Auto Trading\n' +
      '• Parar o recebimento de sinais\n' +
      '• Remover a validação atual\n\n' +
      'Você precisará validar novamente para reconectar.'
    )

    if (!confirmDisconnect) {
      return
    }

    try {
      const response = await fetch('https://nexocrypto-backend.onrender.com/api/telegram/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: currentUUID
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Reset do estado
        setCurrentUUID('')
        setIsValidated(false)
        setTelegramValidated(false)
        setTelegramValidationStatus('NÃO VALIDADO')
        setTelegramUsername('')
        setTelegramGroups([])
        
        // Limpa localStorage
        localStorage.removeItem(`telegram_validation_${currentUUID}`)
        localStorage.removeItem(`telegram_username_${currentUUID}`)
        localStorage.removeItem('nexocrypto_current_uuid')
        
        alert('Desconectado do Telegram com sucesso!\n\nPara reconectar, gere um novo UUID e valide novamente.')
        
        // Gera novo UUID automaticamente
        generateNewUUID()
      } else {
        alert('Erro ao desconectar: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao desconectar:', error)
      alert('Erro de conexão ao tentar desconectar')
    }
  }

  const handleBackToLogin = () => {
    setShowRegister(false)
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
      time: '17:30',
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
      time: '17:15',
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
      time: '16:45',
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
      time: '17:30',
      category: 'Market',
      impact: 'High'
    },
    {
      id: 2,
      title: 'Ethereum 2.0 completa upgrade com sucesso',
      summary: 'Rede Ethereum implementa melhorias de escalabilidade e eficiência energética',
      source: 'CoinTelegraph',
      date: '08/08/2025',
      time: '17:15',
      category: 'Technology',
      impact: 'High'
    },
    {
      id: 3,
      title: 'Regulamentação cripto avança no Brasil',
      summary: 'Banco Central anuncia novas diretrizes para exchanges e stablecoins',
      source: 'InfoMoney',
      date: '08/08/2025',
      time: '16:00',
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
          <h1 style={{ color: '#E2E8F0', textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>
            NexoCrypto
          </h1>
          <p style={{ color: '#94A3B8', textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Sistema Avançado de Trading
          </p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#CBD5E1', display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Usuário
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #475569',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e) => e.target.style.borderColor = '#475569'}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#CBD5E1', display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Senha
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #475569',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: '#F1F5F9',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e) => e.target.style.borderColor = '#475569'}
                required
              />
            </div>
            
            {loginError && (
              <div style={{ color: '#F87171', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                color: '#F1F5F9',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                e.target.style.transform = 'translateY(0)'
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
                border: '1px solid #DADCE0',
                background: '#FFFFFF',
                color: '#3C4043',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Conecte-se via Google
            </button>
            
            <button
              onClick={() => setShowRegister(true)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #475569',
                background: 'rgba(30, 41, 59, 0.6)',
                color: '#CBD5E1',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(51, 65, 85, 0.8)'
                e.target.style.borderColor = '#64748B'
                e.target.style.color = '#F1F5F9'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(30, 41, 59, 0.6)'
                e.target.style.borderColor = '#475569'
                e.target.style.color = '#CBD5E1'
              }}
            >
              <span>📝</span> Cadastrar
            </button>
            
            <button
              onClick={() => setShowForgotPassword(true)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #475569',
                background: 'rgba(30, 41, 59, 0.6)',
                color: '#CBD5E1',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(51, 65, 85, 0.8)'
                e.target.style.borderColor = '#64748B'
                e.target.style.color = '#F1F5F9'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(30, 41, 59, 0.6)'
                e.target.style.borderColor = '#475569'
                e.target.style.color = '#CBD5E1'
              }}
            >
              <span>🔑</span> Esqueci minha senha
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
        gap: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto',
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '0.5rem',
        borderRadius: '0.75rem',
        border: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
          { id: 'signals', label: 'Sinais', icon: '📈' },
          { id: 'gems', label: 'Gems', icon: '💎' },
          { id: 'news', label: 'Notícias', icon: '📰' },
          { id: 'autotrading', label: 'Auto Trading', icon: '🤖' },
          { id: 'copytrading', label: 'Copy Trading', icon: '👥' },
          { id: 'courses', label: 'Cursos', icon: '🎓' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: activeTab === tab.id ? 'rgba(148, 163, 184, 0.15)' : 'transparent',
              color: activeTab === tab.id ? '#F1F5F9' : '#94A3B8',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#F1F5F9', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
              ⚡ Dashboard Principal
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                color: '#10B981',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Sistema Online
              </div>
              <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                Última atualização: 08/08/2025 17:35
              </span>
            </div>
          </div>

          {/* Estatísticas Principais */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Sinais Ativos</p>
                  <p style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>3</p>
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <span style={{ color: '#10B981', fontSize: '1.25rem' }}>📈</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Taxa de sucesso</span>
                <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: '500' }}>87.5%</span>
              </div>
              <div style={{
                background: 'rgba(148, 163, 184, 0.1)',
                height: '4px',
                borderRadius: '2px',
                marginTop: '0.5rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#10B981',
                  height: '100%',
                  width: '87.5%',
                  borderRadius: '2px'
                }}></div>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Gems Descobertas</p>
                  <p style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>3</p>
                </div>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  <span style={{ color: '#F59E0B', fontSize: '1.25rem' }}>💎</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Potencial médio</span>
                <span style={{ color: '#F59E0B', fontSize: '0.875rem', fontWeight: '500' }}>+450%</span>
              </div>
              <div style={{
                background: 'rgba(148, 163, 184, 0.1)',
                height: '4px',
                borderRadius: '2px',
                marginTop: '0.5rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#F59E0B',
                  height: '100%',
                  width: '75%',
                  borderRadius: '2px'
                }}></div>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Notícias Hoje</p>
                  <p style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>3</p>
                </div>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <span style={{ color: '#3B82F6', fontSize: '1.25rem' }}>📰</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Impacto alto</span>
                <span style={{ color: '#3B82F6', fontSize: '0.875rem', fontWeight: '500' }}>2 notícias</span>
              </div>
              <div style={{
                background: 'rgba(148, 163, 184, 0.1)',
                height: '4px',
                borderRadius: '2px',
                marginTop: '0.5rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#3B82F6',
                  height: '100%',
                  width: '66%',
                  borderRadius: '2px'
                }}></div>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Auto Trading</p>
                  <p style={{ color: isValidated ? '#10B981' : '#EF4444', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    {isValidated ? 'ATIVO' : 'INATIVO'}
                  </p>
                </div>
                <div style={{
                  background: isValidated ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${isValidated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  <span style={{ color: isValidated ? '#10B981' : '#EF4444', fontSize: '1.25rem' }}>🤖</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Status Telegram</span>
                <span style={{ color: isValidated ? '#10B981' : '#EF4444', fontSize: '0.875rem', fontWeight: '500' }}>
                  {isValidated ? 'Validado' : 'Não validado'}
                </span>
              </div>
              <div style={{
                background: 'rgba(148, 163, 184, 0.1)',
                height: '4px',
                borderRadius: '2px',
                marginTop: '0.5rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: isValidated ? '#10B981' : '#EF4444',
                  height: '100%',
                  width: isValidated ? '100%' : '0%',
                  borderRadius: '2px'
                }}></div>
              </div>
            </div>
          </div>

          {/* Status Detalhado dos Sistemas */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#F1F5F9', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
              Status dos Sistemas
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { name: 'API de Sinais', status: 'online', uptime: '99.9%', lastCheck: '17:35', description: 'Monitoramento de sinais em tempo real' },
                { name: 'Bot Telegram', status: 'online', uptime: '98.7%', lastCheck: '17:34', description: '@nexocrypto_trading_bot ativo' },
                { name: 'Análise de Gems', status: 'online', uptime: '99.2%', lastCheck: '17:33', description: 'Varredura automática de oportunidades' },
                { name: 'Feed de Notícias', status: 'online', uptime: '99.8%', lastCheck: '17:35', description: 'Agregação de fontes confiáveis' },
                { name: 'Auto Trading', status: isValidated ? 'online' : 'offline', uptime: isValidated ? '100%' : '0%', lastCheck: isValidated ? '17:35' : 'N/A', description: 'Aguardando validação Telegram' }
              ].map((system, index) => (
                <div key={index} style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: system.status === 'online' ? '#10B981' : '#EF4444',
                      boxShadow: `0 0 8px ${system.status === 'online' ? '#10B981' : '#EF4444'}50`
                    }}></div>
                    <div>
                      <p style={{ color: '#F1F5F9', margin: '0 0 0.25rem 0', fontWeight: '500' }}>{system.name}</p>
                      <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.875rem' }}>{system.description}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      color: system.status === 'online' ? '#10B981' : '#EF4444', 
                      margin: '0 0 0.25rem 0', 
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem'
                    }}>
                      {system.status}
                    </p>
                    <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.875rem' }}>
                      Uptime: {system.uptime} | {system.lastCheck}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo de Performance */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <h3 style={{ color: '#F1F5F9', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
              Performance Geral
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Lucro Total (30 dias)</p>
                <p style={{ color: '#10B981', fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>+24.7%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Trades Executados</p>
                <p style={{ color: '#F1F5F9', fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>127</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Win Rate</p>
                <p style={{ color: '#10B981', fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>84.3%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Sharpe Ratio</p>
                <p style={{ color: '#F1F5F9', fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>2.14</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aba Auto Trading */}
      {activeTab === 'autotrading' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#F1F5F9', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
              🤖 Auto Trading
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                background: isValidated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${isValidated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                color: isValidated ? '#10B981' : '#EF4444',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {isValidated ? 'Sistema Ativo' : 'Sistema Inativo'}
              </div>
            </div>
          </div>

          {/* Painel de Controle Principal */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#F1F5F9', margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
              🎛️ Painel de Controle
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {/* Status do Bot */}
              <div style={{
                background: 'rgba(148, 163, 184, 0.05)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Status do Bot
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: isValidated ? '#10B981' : '#EF4444',
                    boxShadow: `0 0 8px ${isValidated ? '#10B981' : '#EF4444'}50`
                  }}></div>
                  <span style={{ 
                    color: isValidated ? '#10B981' : '#EF4444', 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {isValidated ? 'ATIVO' : 'INATIVO'}
                  </span>
                </div>
              </div>

              {/* Valor Máximo por Operação */}
              <div style={{
                background: 'rgba(148, 163, 184, 0.05)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Valor Máximo por Operação
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    defaultValue="100"
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '0.375rem',
                      color: '#F1F5F9',
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      width: '80px'
                    }}
                  />
                  <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>USDT</span>
                </div>
              </div>

              {/* Percentual do Saldo */}
              <div style={{
                background: 'rgba(148, 163, 184, 0.05)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  % do Saldo por Trade
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="2"
                  style={{ 
                    width: '100%', 
                    marginBottom: '0.5rem',
                    accentColor: '#10B981'
                  }}
                />
                <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: '500' }}>2%</span>
              </div>

              {/* Análise Automática */}
              <div style={{
                background: 'rgba(148, 163, 184, 0.05)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Análise Automática
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#10B981' }} />
                  <span style={{ color: '#F1F5F9', fontSize: '0.875rem' }}>Validar sinais antes de executar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações Avançadas */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#F1F5F9', margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
              ⚙️ Configurações Avançadas
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Corretora */}
              <div>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Corretora Preferencial
                </label>
                <select style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '0.375rem',
                  color: '#F1F5F9',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  width: '100%'
                }}>
                  <option value="bybit">ByBit</option>
                  <option value="binance">Binance</option>
                  <option value="mexc">MEXC</option>
                </select>
              </div>

              {/* Pares Permitidos */}
              <div>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Pares Permitidos
                </label>
                <select style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '0.375rem',
                  color: '#F1F5F9',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  width: '100%'
                }}>
                  <option value="all">Todos os pares /USDT</option>
                  <option value="btc">Apenas BTC/USDT</option>
                  <option value="eth">Apenas ETH/USDT</option>
                  <option value="major">Apenas moedas principais</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              {/* Stop Loss */}
              <div>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Stop Loss Automático
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    defaultValue="5"
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '0.375rem',
                      color: '#F1F5F9',
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      width: '60px'
                    }}
                  />
                  <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>%</span>
                </div>
              </div>

              {/* Take Profit */}
              <div>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Take Profit Automático
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    defaultValue="15"
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '0.375rem',
                      color: '#F1F5F9',
                      padding: '0.5rem',
                      fontSize: '0.875rem',
                      width: '60px'
                    }}
                  />
                  <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>%</span>
                </div>
              </div>

              {/* Alavancagem */}
              <div>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Alavancagem Máxima
                </label>
                <select style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '0.375rem',
                  color: '#F1F5F9',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  width: '100%'
                }}>
                  <option value="1">1x (Spot)</option>
                  <option value="5">5x</option>
                  <option value="10">10x</option>
                  <option value="20">20x</option>
                  <option value="50">50x</option>
                </select>
              </div>

              {/* Horário de Funcionamento */}
              <div>
                <label style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>
                  Horário de Funcionamento
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#10B981' }} />
                  <span style={{ color: '#F1F5F9', fontSize: '0.875rem' }}>24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validação Telegram */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#F1F5F9', margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
              📱 Validação Telegram
            </h3>
            
            <div style={{
              background: 'rgba(148, 163, 184, 0.05)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              marginBottom: '1rem'
            }}>
              <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
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

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={generateNewUUID}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Verificar Validação
              </button>

              {isValidated && (
                <button
                  onClick={disconnectTelegram}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  🔌 Desconectar
                </button>
              )}
            </div>

            {/* Status da Validação */}
            <div style={{
              background: isValidated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isValidated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <p style={{ 
                color: isValidated ? '#10B981' : '#EF4444',
                margin: 0,
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                {isValidated ? '✅ VALIDADO' : '❌ NÃO VALIDADO'}
              </p>
              {isValidated && telegramUsername && (
                <p style={{ color: '#94A3B8', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                  Usuário: {telegramUsername}
                </p>
              )}
            </div>

            {/* Instruções */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}>
              <h4 style={{ color: '#3B82F6', margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600' }}>
                📋 Como validar:
              </h4>
              <ol style={{ color: '#94A3B8', margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
                <li>Copie o UUID acima</li>
                <li>Acesse o bot: @nexocrypto_trading_bot</li>
                <li>Digite: /validate [UUID]</li>
                <li>Clique em "Verificar Validação"</li>
              </ol>
            </div>
          </div>

          {/* Grupos Telegram Conectados */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#F1F5F9', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                📱 Grupos Telegram Conectados
              </h3>
              {telegramValidationStatus === 'VALIDADO' && (
                <button
                  onClick={startUserbotAuth}
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  🔗 Conectar Grupos Reais
                </button>
              )}
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {telegramGroups.length > 0 ? telegramGroups.map((group, index) => (
                <div key={index} style={{
                  background: 'rgba(148, 163, 184, 0.05)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: group.is_monitored ? '#10B981' : '#94A3B8',
                      boxShadow: `0 0 8px ${group.is_monitored ? '#10B981' : '#94A3B8'}50`
                    }}></div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <p style={{ color: '#F1F5F9', margin: 0, fontWeight: '500' }}>{group.name}</p>
                        {group.isDemo || group.source !== 'userbot_real' ? (
                          <span style={{
                            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                            color: 'white',
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                          }}>
                            DEMO
                          </span>
                        ) : (
                          <span style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: 'white',
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                          }}>
                            REAL
                          </span>
                        )}
                      </div>
                      <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.875rem' }}>
                        {group.type} • {group.is_monitored ? 'Monitorando' : 'Disponível'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#F1F5F9', margin: '0 0 0.25rem 0', fontWeight: '500' }}>{group.signals_count}</p>
                      <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.875rem' }}>sinais</p>
                    </div>
                    <button
                      onClick={() => toggleGroupMonitoring(group.id, !group.is_monitored)}
                      style={{
                        background: group.is_monitored ? '#EF4444' : '#10B981',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {group.is_monitored ? 'Parar' : 'Monitorar'}
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{
                  background: 'rgba(148, 163, 184, 0.05)',
                  padding: '2rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      📋 GRUPOS DEMO
                    </span>
                  </div>
                  <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {telegramValidated ? 
                      'Conecte seus grupos reais clicando em "Conectar Grupos Reais" para monitorar sinais dos grupos que você participa.' : 
                      'Valide seu Telegram primeiro para ver grupos demo e depois conecte seus grupos reais.'
                    }
                  </p>
                </div>
              )}
            </div>

            {telegramValidated && (
              <button 
                onClick={loadTelegramGroups}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '1rem',
                  width: '100%'
                }}
              >
                🔄 Atualizar Grupos
              </button>
            )}
          </div>

          {/* Modal de Autorização Userbot */}
          {userbotAuthStep !== 'idle' && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'rgba(30, 41, 59, 0.95)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                backdropFilter: 'blur(10px)',
                maxWidth: '400px',
                width: '90%'
              }}>
                {userbotAuthStep === 'phone' && (
                  <>
                    <h3 style={{ color: '#F1F5F9', margin: '0 0 1rem 0', textAlign: 'center' }}>
                      📱 Conectar Grupos Reais
                    </h3>
                    <p style={{ color: '#94A3B8', margin: '0 0 1.5rem 0', textAlign: 'center', fontSize: '0.875rem' }}>
                      Digite seu número de telefone para autorizar o acesso aos seus grupos do Telegram
                    </p>
                    <input
                      type="tel"
                      placeholder="+55 11 99999-9999"
                      value={userbotPhone}
                      onChange={(e) => setUserbotPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#F1F5F9',
                        fontSize: '1rem',
                        marginBottom: '1.5rem'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={() => setUserbotAuthStep('idle')}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          background: 'transparent',
                          color: '#94A3B8',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={sendPhoneForAuth}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Enviar Código
                      </button>
                    </div>
                  </>
                )}

                {userbotAuthStep === 'code' && (
                  <>
                    <h3 style={{ color: '#F1F5F9', margin: '0 0 1rem 0', textAlign: 'center' }}>
                      🔐 Código de Verificação
                    </h3>
                    <p style={{ color: '#94A3B8', margin: '0 0 1.5rem 0', textAlign: 'center', fontSize: '0.875rem' }}>
                      Digite o código de verificação enviado para {userbotPhone}
                    </p>
                    <input
                      type="text"
                      placeholder="12345"
                      value={userbotCode}
                      onChange={(e) => setUserbotCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#F1F5F9',
                        fontSize: '1rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        letterSpacing: '0.2rem'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={() => setUserbotAuthStep('phone')}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          background: 'transparent',
                          color: '#94A3B8',
                          cursor: 'pointer'
                        }}
                      >
                        Voltar
                      </button>
                      <button
                        onClick={verifyAuthCode}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Verificar
                      </button>
                    </div>
                  </>
                )}

                {userbotAuthStep === 'authorized' && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                      <h3 style={{ color: '#10B981', margin: '0 0 1rem 0' }}>
                        Autorização Bem-sucedida!
                      </h3>
                      <p style={{ color: '#94A3B8', margin: '0 0 1.5rem 0', fontSize: '0.875rem' }}>
                        Seus grupos reais do Telegram foram carregados com sucesso.
                      </p>
                      <button
                        onClick={() => setUserbotAuthStep('idle')}
                        style={{
                          padding: '0.75rem 2rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Continuar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Estatísticas em Tempo Real */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#F1F5F9', margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
              📊 Estatísticas em Tempo Real
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Sinais Recebidos</p>
                <p style={{ color: '#F1F5F9', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>23</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Executados</p>
                <p style={{ color: '#10B981', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>18</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Rejeitados</p>
                <p style={{ color: '#EF4444', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>5</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Taxa de Sucesso</p>
                <p style={{ color: '#10B981', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>83%</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Precisão IA</p>
                <p style={{ color: '#10B981', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>91%</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Saldo ByBit</p>
                <p style={{ color: '#F1F5F9', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>2,450</p>
                <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.75rem' }}>USDT</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>P&L Hoje</p>
                <p style={{ color: '#10B981', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>+45.30</p>
                <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.75rem' }}>USDT</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>P&L Total</p>
                <p style={{ color: '#10B981', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>+1,247</p>
                <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.75rem' }}>USDT</p>
              </div>
            </div>
          </div>

          {/* Últimas Operações */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <h3 style={{ color: '#F1F5F9', margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
              📈 Últimas Operações
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { pair: 'BTCUSDT', type: 'LONG', result: '+2.3%', source: 'Binance Killers', color: '#10B981', time: '17:32', entry: '67,450', exit: '69,001' },
                { pair: 'ETHUSDT', type: 'SHORT', result: '-1.1%', source: 'ByBit Pro', color: '#EF4444', time: '17:15', entry: '3,245', exit: '3,209' },
                { pair: 'SOLUSDT', type: 'LONG', result: 'Em andamento', source: 'Binance Killers', color: '#F59E0B', time: '16:47', entry: '142.30', exit: '-' }
              ].map((trade, index) => (
                <div key={index} style={{
                  background: 'rgba(148, 163, 184, 0.05)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#F1F5F9', fontSize: '0.875rem', fontWeight: '600' }}>
                          {trade.pair}
                        </span>
                        <span style={{
                          background: trade.type === 'LONG' ? '#10B981' : '#EF4444',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {trade.type}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                        <span>Entrada: {trade.entry}</span>
                        <span>Saída: {trade.exit}</span>
                        <span>{trade.time}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      color: trade.color, 
                      margin: '0 0 0.25rem 0', 
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      {trade.result}
                    </p>
                    <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.75rem' }}>
                      {trade.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#F1F5F9', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
              📈 Sinais de Trading
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                Última atualização: 08/08/2025 17:35
              </span>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                color: '#10B981',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                3 Sinais Ativos
              </div>
            </div>
          </div>

          {/* Estatísticas dos Sinais */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Taxa de Sucesso</p>
              <p style={{ color: '#10B981', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>87.5%</p>
            </div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Lucro Médio</p>
              <p style={{ color: '#10B981', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>+12.3%</p>
            </div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Sinais Hoje</p>
              <p style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>8</p>
            </div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Volume Total</p>
              <p style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>$2.4M</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {mockSignals.map(signal => (
              <div key={signal.id} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                position: 'relative'
              }}>
                {/* Header do Sinal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ color: '#F1F5F9', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
                      {signal.symbol}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{
                        background: signal.type === 'LONG' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: signal.type === 'LONG' ? '#10B981' : '#EF4444',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        border: `1px solid ${signal.type === 'LONG' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {signal.type}
                      </span>
                      <span style={{
                        background: 'rgba(148, 163, 184, 0.1)',
                        color: '#94A3B8',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}>
                        Confiança: {signal.confidence}%
                      </span>
                      <span style={{
                        background: signal.status === 'Lucro' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: signal.status === 'Lucro' ? '#10B981' : '#3B82F6',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        border: `1px solid ${signal.status === 'Lucro' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                      }}>
                        {signal.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>
                      {signal.date} às {signal.time}
                    </p>
                    <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.875rem' }}>
                      ID: #{signal.id.toString().padStart(4, '0')}
                    </p>
                  </div>
                </div>

                {/* Dados de Preço */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '1rem', 
                  marginBottom: '1.5rem',
                  background: 'rgba(148, 163, 184, 0.05)',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Preço de Entrada</p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>${signal.entry}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Preço Atual</p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>${signal.currentPrice}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Stop Loss</p>
                    <p style={{ color: '#EF4444', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>${signal.stopLoss}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>P&L Atual</p>
                    <p style={{ 
                      color: signal.type === 'LONG' ? '#10B981' : '#EF4444', 
                      margin: 0, 
                      fontWeight: '600', 
                      fontSize: '1.1rem' 
                    }}>
                      {signal.type === 'LONG' ? '+2.1%' : '+1.1%'}
                    </p>
                  </div>
                </div>

                {/* Targets */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '500' }}>
                    Targets de Lucro:
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {signal.targets.map((target, index) => (
                      <div key={index} style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>T{index + 1}</span>
                        ${target}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Análise Técnica */}
                <div style={{
                  background: 'rgba(148, 163, 184, 0.05)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(148, 163, 184, 0.1)'
                }}>
                  <p style={{ color: '#94A3B8', margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '500' }}>
                    Análise Técnica:
                  </p>
                  <p style={{ color: '#F1F5F9', margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {signal.symbol === 'BTC/USDT' && 'Rompimento de resistência em $67,800 com volume crescente. RSI em 65, MACD bullish. Suporte forte em $67,200.'}
                    {signal.symbol === 'ETH/USDT' && 'Padrão de reversão identificado. Divergência bearish no RSI. Resistência em $2,700, alvo de queda para $2,500.'}
                    {signal.symbol === 'SOL/USDT' && 'Breakout confirmado acima de $185. Volume excepcional, momentum forte. Próxima resistência em $200.'}
                  </p>
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

      {/* Aba Copy Trading */}
      {activeTab === 'copytrading' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#F1F5F9', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
              👥 Copy Trading
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                Traders disponíveis: 12
              </span>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                color: '#10B981',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Sistema Ativo
              </div>
            </div>
          </div>

          {/* Top Traders */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              { id: 1, name: 'CryptoMaster Pro', roi: '+187.3%', followers: 2847, winRate: '89.2%', trades: 156, risk: 'Médio', avatar: '🏆' },
              { id: 2, name: 'Bitcoin Whale', roi: '+142.8%', followers: 1923, winRate: '84.7%', trades: 203, risk: 'Alto', avatar: '🐋' },
              { id: 3, name: 'Altcoin Hunter', roi: '+98.5%', followers: 1456, winRate: '76.3%', trades: 89, risk: 'Baixo', avatar: '🎯' }
            ].map(trader => (
              <div key={trader.id} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      background: 'rgba(148, 163, 184, 0.1)',
                      padding: '1rem',
                      borderRadius: '50%',
                      fontSize: '1.5rem'
                    }}>
                      {trader.avatar}
                    </div>
                    <div>
                      <h3 style={{ color: '#F1F5F9', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
                        {trader.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                          {trader.followers} seguidores
                        </span>
                        <span style={{
                          background: trader.risk === 'Alto' ? 'rgba(239, 68, 68, 0.15)' : trader.risk === 'Médio' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: trader.risk === 'Alto' ? '#EF4444' : trader.risk === 'Médio' ? '#F59E0B' : '#10B981',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          border: `1px solid ${trader.risk === 'Alto' ? 'rgba(239, 68, 68, 0.3)' : trader.risk === 'Médio' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                        }}>
                          Risco {trader.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Copiar Trader
                  </button>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '1rem',
                  background: 'rgba(148, 163, 184, 0.05)',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>ROI (30 dias)</p>
                    <p style={{ color: '#10B981', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>{trader.roi}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Win Rate</p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>{trader.winRate}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94A3B8', margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Trades</p>
                    <p style={{ color: '#F1F5F9', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>{trader.trades}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba Cursos */}
      {activeTab === 'courses' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#F1F5F9', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
              🎓 Cursos de Trading
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                12 cursos disponíveis
              </span>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                color: '#3B82F6',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Novos Conteúdos
              </div>
            </div>
          </div>

          {/* Categorias de Cursos */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              { 
                id: 1, 
                title: 'Trading para Iniciantes', 
                description: 'Aprenda os fundamentos do trading de criptomoedas do zero',
                duration: '8 horas',
                lessons: 24,
                level: 'Iniciante',
                price: 'Gratuito',
                rating: 4.8,
                students: 1247,
                icon: '📚'
              },
              { 
                id: 2, 
                title: 'Análise Técnica Avançada', 
                description: 'Domine indicadores, padrões gráficos e estratégias profissionais',
                duration: '12 horas',
                lessons: 36,
                level: 'Avançado',
                price: 'R$ 297',
                rating: 4.9,
                students: 892,
                icon: '📈'
              },
              { 
                id: 3, 
                title: 'Gestão de Risco e Psicologia', 
                description: 'Controle emocional e técnicas de gerenciamento de capital',
                duration: '6 horas',
                lessons: 18,
                level: 'Intermediário',
                price: 'R$ 197',
                rating: 4.7,
                students: 654,
                icon: '🧠'
              }
            ].map(course => (
              <div key={course.id} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      fontSize: '1.5rem',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      {course.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#F1F5F9', margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
                        {course.title}
                      </h3>
                      <p style={{ color: '#94A3B8', margin: '0 0 1rem 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
                        {course.description}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          background: course.level === 'Iniciante' ? 'rgba(16, 185, 129, 0.15)' : course.level === 'Intermediário' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: course.level === 'Iniciante' ? '#10B981' : course.level === 'Intermediário' ? '#F59E0B' : '#EF4444',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          border: `1px solid ${course.level === 'Iniciante' ? 'rgba(16, 185, 129, 0.3)' : course.level === 'Intermediário' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                          {course.level}
                        </span>
                        <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                          {course.duration} • {course.lessons} aulas
                        </span>
                        <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                          ⭐ {course.rating} ({course.students} alunos)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#F1F5F9', fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>
                      {course.price}
                    </p>
                    <button style={{
                      background: course.price === 'Gratuito' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      {course.price === 'Gratuito' ? 'Começar Agora' : 'Comprar Curso'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Seleção de Grupos */}
      {showGroupSelection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid #334155'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                color: '#F1F5F9', 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                📋 Selecionar Grupos para Monitoramento
              </h3>
              <p style={{ 
                color: '#94A3B8', 
                margin: 0, 
                fontSize: '0.9rem' 
              }}>
                Escolha exatamente 5 grupos dos seus grupos reais do Telegram para monitoramento de sinais.
              </p>
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#0F172A',
                borderRadius: '0.5rem',
                border: '1px solid #334155'
              }}>
                <span style={{ color: '#10B981', fontWeight: '600' }}>
                  {selectedGroups.length}/5 grupos selecionados
                </span>
              </div>
            </div>

            {loadingGroups ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#94A3B8' }}>Carregando grupos disponíveis...</div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                {availableGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => toggleGroupSelection(group.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      backgroundColor: selectedGroups.includes(group.id) ? '#065F46' : '#0F172A',
                      border: `1px solid ${selectedGroups.includes(group.id) ? '#10B981' : '#334155'}`,
                      borderRadius: '0.5rem',
                      cursor: selectedGroups.length < 5 || selectedGroups.includes(group.id) ? 'pointer' : 'not-allowed',
                      opacity: selectedGroups.length >= 5 && !selectedGroups.includes(group.id) ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: `2px solid ${selectedGroups.includes(group.id) ? '#10B981' : '#64748B'}`,
                      backgroundColor: selectedGroups.includes(group.id) ? '#10B981' : 'transparent',
                      marginRight: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {selectedGroups.includes(group.id) && (
                        <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        color: '#F1F5F9', 
                        fontWeight: '500',
                        marginBottom: '0.25rem'
                      }}>
                        {group.name}
                      </div>
                      <div style={{ 
                        color: '#94A3B8', 
                        fontSize: '0.8rem' 
                      }}>
                        {group.type} • {group.members || 0} membros
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => setShowGroupSelection(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #64748B',
                  backgroundColor: 'transparent',
                  color: '#94A3B8',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmGroupSelection}
                disabled={selectedGroups.length !== 5}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: selectedGroups.length === 5 ? '#10B981' : '#64748B',
                  color: 'white',
                  fontWeight: '500',
                  cursor: selectedGroups.length === 5 ? 'pointer' : 'not-allowed',
                  opacity: selectedGroups.length === 5 ? 1 : 0.6
                }}
              >
                Confirmar Seleção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

