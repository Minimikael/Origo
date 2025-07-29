import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'
import { supabase } from '../services/supabase'

const Auth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasskeyStep, setShowPasskeyStep] = useState(false)
  const [passkey, setPasskey] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [showNameStep, setShowNameStep] = useState(false)
  const [userName, setUserName] = useState('')
  const [passkeyVerified, setPasskeyVerified] = useState(false)
  
  const { user } = useAuth()

  // Check if passkey has been verified on this computer
  useEffect(() => {
    const hasVerifiedPasskey = localStorage.getItem('origo_passkey_verified')
    if (hasVerifiedPasskey === 'true') {
      setPasskeyVerified(true)
    } else {
      setShowPasskeyStep(true)
    }
  }, [])

  // If user is authenticated and passkey is verified, redirect to dashboard
  useEffect(() => {
    if (user && passkeyVerified) {
      window.location.href = '/'
    }
  }, [user, passkeyVerified])

  const handlePasskeySubmit = (e) => {
    e.preventDefault()
    if (passkey === '#mosten69!yxz') {
      // Remember that passkey has been verified on this computer
      localStorage.setItem('origo_passkey_verified', 'true')
      setPasskeyVerified(true)
      setShowPasskeyStep(false)
      setPasskey('')
      setError('')
    } else {
      setError('Invalid passkey')
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(error.message)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          })
        : await supabase.auth.signInWithPassword({
            email,
            password
          })

      if (error) {
        setError(error.message)
      } else {
        // For email sign-ups, show name input step
        setShowNameStep(true)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    if (!userName.trim()) {
      setError('Please enter your name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          display_name: userName.trim(),
          full_name: userName.trim()
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setShowNameStep(false)
        setUserName('')
        setError('')
        // Redirect to dashboard
        window.location.href = '/'
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Show passkey verification first - this is a complete gate
  if (showPasskeyStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div>
            <h2 className="text-center text-3xl font-bold text-white">
              Welcome to Origo
            </h2>
            <p className="mt-2 text-center text-gray-300">
              Please enter the passkey to access the application
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasskeySubmit}>
            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Show name input step for email sign-ups
  if (showNameStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div>
            <h2 className="text-center text-3xl font-bold text-white">
              Welcome!
            </h2>
            <p className="mt-2 text-center text-gray-300">
              Please tell us your name to personalize your experience
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleNameSubmit}>
            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Only show sign-up/sign-in options after passkey verification
  if (!passkeyVerified) {
    return null // Don't show anything if passkey isn't verified
  }

  // Show sign-up/sign-in options after passkey verification
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
          <p className="mt-2 text-center text-gray-300">
            {isSignUp ? 'Create your account to get started' : 'Welcome back! Sign in to your account'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleEmailSignIn}>
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </div>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-300">Or continue with</span>
          </div>
        </div>
        
        {/* Google Sign In Button */}
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="secondary"
            fullWidth
            className="flex items-center justify-center space-x-2 bg-white text-gray-800 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
        </div>
        
        <div className="text-center">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-300 text-sm"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setEmail('')
              setPassword('')
            }}
          >
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth 