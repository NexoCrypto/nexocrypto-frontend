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

      {/* Auto Trading Section */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '2rem',
        borderRadius: '1rem',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        backdropFilter: 'blur(10px)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#10B981', marginBottom: '1.5rem' }}>
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
    </div>
  )
}

export default App

