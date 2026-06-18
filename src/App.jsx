import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Cart from './pages/Cart/Cart'
import AdminLogin from './pages/Admin/Login/Login'
import AdminDashboard from './pages/Admin/Dashboard/Dashboard'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import BackToTop from './components/BackToTop/BackToTop'
import { useAuth } from './context/AuthContext'

function ProtectedLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 50%, #f0fdf4 100%)',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '1.25rem',
        color: '#0d9488',
        fontWeight: '600'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚕️</div>
          Loading LifeLine Pharmacy...
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
        <Route path="/products" element={<ProtectedLayout><Products /></ProtectedLayout>} />
        <Route path="/about" element={<ProtectedLayout><About /></ProtectedLayout>} />
        <Route path="/contact" element={<ProtectedLayout><Contact /></ProtectedLayout>} />
        <Route path="/cart" element={<ProtectedLayout><Cart /></ProtectedLayout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <BackToTop />
    </>
  )
}
