import React, { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '../services/supabase'
import { supabase } from '../services/supabase'

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
  const [passkeyVerified, setPasskeyVerified] = useState(false)

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.log('No existing session')
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        if (session?.user) {
          setUser(session.user)
          // Reset passkey verification when user changes
          setPasskeyVerified(false)
        } else {
          setUser(null)
          setPasskeyVerified(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      await userService.signIn(email, password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email, password) => {
    try {
      await userService.signUp(email, password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await userService.signOut()
      setPasskeyVerified(false)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const verifyPasskey = (passkey) => {
    if (passkey === "#mosten69!yxz") {
      setPasskeyVerified(true)
      return true
    }
    return false
  }

  const value = {
    user,
    loading,
    passkeyVerified,
    signIn,
    signUp,
    signOut,
    verifyPasskey
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 