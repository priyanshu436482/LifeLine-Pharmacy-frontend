import { createContext, useContext, useState, useEffect } from 'react'
import { getApiUrl } from '../utils/apiUrl'

const AuthContext = createContext(null)

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // JWT exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('userToken')
    const savedUser = localStorage.getItem('userData')
    
    if (savedToken && savedUser) {
      // Verify token hasn't expired before restoring session
      if (isTokenExpired(savedToken)) {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
      } else {
        setToken(savedToken)
        try {
          setUser(JSON.parse(savedUser))
        } catch (err) {
          console.error('Error parsing saved userData', err)
        }
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (response.ok && data.success) {
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Login failed.' }
      }
    } catch (err) {
      console.error('Login request failed', err)
      return { success: false, message: 'Server is currently unreachable.' }
    }
  }

  const register = async ({ email, password, firstName, lastName }) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })

      const data = await response.json()
      if (response.ok && data.success) {
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Registration failed.' }
      }
    } catch (err) {
      console.error('Registration request failed', err)
      return { success: false, message: 'Server is currently unreachable.' }
    }
  }

  const loginWithGoogle = async (credential) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      })

      const data = await response.json()
      if (response.ok && data.success) {
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Google login failed.' }
      }
    } catch (err) {
      console.error('Google login request failed', err)
      return { success: false, message: 'Server is currently unreachable.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
