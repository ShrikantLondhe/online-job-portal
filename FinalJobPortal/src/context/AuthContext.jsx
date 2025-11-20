/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('jobPortalUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Check if user exists in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const existingUser = registeredUsers.find(u => u.email === email && u.password === password)
    
    if (existingUser) {
      const userData = { email, isAdmin: email === 'admin@jobportal.com' }
      setUser(userData)
      localStorage.setItem('jobPortalUser', JSON.stringify(userData))
      toast.success('Login successful!')
      return true
    } else {
      toast.error('Invalid email or password!')
      return false
    }
  }

  const register = (email, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    
    // Check if user already exists
    if (registeredUsers.find(u => u.email === email)) {
      toast.error('User already exists!')
      return false
    }

    // Add new user
    registeredUsers.push({ email, password })
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    toast.success('Registration successful! Please login.')
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('jobPortalUser')
    toast.success('Logged out successfully!')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}