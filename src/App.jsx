import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')

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
        </div>
      </div>
    )
  }

  // Dashboard simples
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#10B981', textAlign: 'center' }}>
        Dashboard NexoCrypto
      </h1>
      <p style={{ color: '#94A3B8', textAlign: 'center' }}>
        Login realizado com sucesso!
      </p>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
    </div>
  )
}

export default App

