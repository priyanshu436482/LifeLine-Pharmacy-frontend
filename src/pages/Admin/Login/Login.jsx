import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '../../../utils/apiUrl'
import './Login.css'

export default function AdminLogin() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${getApiUrl()}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password })
      })

      let data
      try {
        data = await response.json()
      } catch {
        setError('Server error. Is the backend running? (npm run dev in project root)')
        return
      }

      if (response.ok && data.success) {
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminId', data.adminId)
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid Admin ID or password')
      }
    } catch (err) {
      setError('Cannot reach server. Run: npm run dev (from project folder)')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Admin ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter admin ID"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
