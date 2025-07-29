import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'
import { supabase } from '../services/supabase'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasskeyStep, setShowPasskeyStep] = useState(false)
  const [passkey, setPasskey] = useState('')
  const [userData, setUserData] = useState(null)
  
  const { signIn, signUp, verifyPasskey, user, passkeyVerified } = useAuth()

  // Show passkey step if user is authenticated but passkey is not verified
  useEffect(() => {
    if (user && !passkeyVerified) {
      setShowPasskeyStep(true)
    }
  }, [user, passkeyVerified])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) {
        setError(error.message)
      } else {
        // Store user data for passkey step
        setUserData(data)
        setShowPasskeyStep(true)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasskeySubmit = (e) => {
    e.preventDefault()
    if (verifyPasskey(passkey)) {
      // Passkey is correct, proceed with authentication
      setShowPasskeyStep(false)
      setPasskey('')
      // The user is now authenticated
    } else {
      setError('Invalid passkey')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (!result.success) {
        setError(result.error)
      } else {
        // Show passkey step after successful email/password auth
        setShowPasskeyStep(true)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (showPasskeyStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-blue-800 rounded-lg shadow-lg">
          <div>
            <h2 className="text-center text-3xl font-bold text-white">
              Security Verification
            </h2>
            <p className="mt-2 text-center text-blue-200">
              Please enter your passkey to complete authentication
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
                className="w-full px-3 py-2 border border-blue-600 rounded-md bg-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
              />
            </div>
            
            <div>
              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Verify Passkey
              </Button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                className="text-blue-300 hover:text-blue-200 text-sm"
                onClick={() => setShowPasskeyStep(false)}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-blue-800 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Sign Up
          </h2>
          <p className="mt-2 text-center text-blue-200">
            Create your account to get started
          </p>
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
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-blue-800 text-blue-400">Or continue with email</span>
            </div>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-blue-600 rounded-md bg-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-blue-600 rounded-md bg-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          <div className="text-center">
            <button
              type="button"
              className="text-blue-300 hover:text-blue-200 text-sm"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth 