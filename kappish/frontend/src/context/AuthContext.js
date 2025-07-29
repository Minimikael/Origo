import React, { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '../services/supabase'

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
    // Check for existing session
    const checkUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.log('No existing session')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const signIn = async (email, password) => {
    try {
      const { user } = await userService.signIn(email, password)
      setUser(user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email, password) => {
    try {
      const { user } = await userService.signUp(email, password)
      setUser(user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await userService.signOut()
      setUser(null)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 