import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'
import { supabase } from '../services/supabase'

const Auth = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passkey, setPasskey] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [currentStep, setCurrentStep] = useState('loading') // 'loading', 'passkey', 'signup', 'username'
  const [progress, setProgress] = useState(0)
  
  const { user } = useAuth()

  // Initialize the component and determine which step to show
  useEffect(() => {
    const hasVerifiedPasskey = localStorage.getItem('origo_passkey_verified') === 'true'
    
    if (hasVerifiedPasskey) {
      setCurrentStep('signup')
    } else {
      setCurrentStep('passkey')
    }
  }, [])

  // If user is authenticated and has username, redirect to dashboard
  useEffect(() => {
    if (user && user.user_metadata?.display_name) {
      navigate('/')
    }
  }, [user, navigate])

  const handlePasskeySubmit = (e) => {
    e.preventDefault()
    if (passkey === '#mosten69!yxz') {
      // Remember that passkey has been verified on this computer
      localStorage.setItem('origo_passkey_verified', 'true')
      setCurrentStep('signup')
      setPasskey('')
      setError('')
    } else {
      setError('Invalid passkey')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(error.message)
      } else {
        // Since email confirmation is disabled, go directly to username step
        setCurrentStep('username')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameSubmit = async (e) => {
    e.preventDefault()
    if (!userName.trim()) {
      setError('Please enter your name')
      return
    }

    setLoading(true)
    setError('')
    setProgress(0)

    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          display_name: userName.trim(),
          full_name: userName.trim()
        }
      })

      if (error) {
        setError(error.message)
        clearInterval(progressInterval)
        setProgress(0)
      } else {
        // Complete the progress animation
        setProgress(100)
        
        // Wait a moment for the animation to complete
        setTimeout(() => {
          setUserName('')
          setError('')
          // Use React Router navigation instead of window.location
          navigate('/')
        }, 500)
      }
    } catch (error) {
      setError(error.message)
      clearInterval(progressInterval)
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while determining which step to show
  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Step 1: Passkey verification
  if (currentStep === 'passkey') {
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

  // Step 2: Email and password sign-up
  if (currentStep === 'signup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div>
            <h2 className="text-center text-3xl font-bold text-white">
              Create Your Account
            </h2>
            <p className="mt-2 text-center text-gray-300">
              Enter your email and password to get started
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
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
                autoFocus
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
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Step 3: Username input with loading animation
  if (currentStep === 'username') {
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
          
          {loading && progress > 0 ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-white text-lg mb-4">Setting up your account...</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-gray-400 text-sm">{progress}% complete</div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleUsernameSubmit}>
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
                  disabled={loading}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  Complete Setup
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default Auth 