import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import Button from '../ui/Button';
import Typography, { Heading2, BodyMedium } from '../ui/Typography';

const SupabaseTest = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get initial session
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Error getting session:', error);
    }
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    const results = [];

    // Test 1: Connection
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) throw error;
      results.push({ test: 'Database Connection', status: '✅ PASS', details: 'Successfully connected to Supabase' });
    } catch (error) {
      results.push({ test: 'Database Connection', status: '❌ FAIL', details: error.message });
    }

    // Test 2: Authentication
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      results.push({ test: 'Authentication', status: '✅ PASS', details: 'Auth system working' });
    } catch (error) {
      results.push({ test: 'Authentication', status: '❌ FAIL', details: error.message });
    }

    // Test 3: RLS Policies
    try {
      const { data, error } = await supabase.from('documents').select('*').limit(1);
      if (error && error.code === 'PGRST116') {
        results.push({ test: 'RLS Policies', status: '✅ PASS', details: 'Row Level Security is working (expected no access when not authenticated)' });
      } else if (error) {
        results.push({ test: 'RLS Policies', status: '❌ FAIL', details: error.message });
      } else {
        results.push({ test: 'RLS Policies', status: '⚠️ WARNING', details: 'RLS might not be properly configured' });
      }
    } catch (error) {
      results.push({ test: 'RLS Policies', status: '❌ FAIL', details: error.message });
    }

    // Test 4: Real-time
    try {
      const channel = supabase.channel('test-channel');
      const subscription = channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          results.push({ test: 'Real-time', status: '✅ PASS', details: 'Real-time subscriptions working' });
          channel.unsubscribe();
        }
      });
    } catch (error) {
      results.push({ test: 'Real-time', status: '❌ FAIL', details: error.message });
    }

    setTestResults(results);
    setLoading(false);
  };

  const signInTest = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      });
      
      if (error) {
        alert(`Sign in failed: ${error.message}`);
      } else {
        alert('Sign in successful!');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const signUpTest = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      });
      
      if (error) {
        alert(`Sign up failed: ${error.message}`);
      } else {
        alert('Sign up successful! Check your email for confirmation.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Heading2>Supabase Connection Test</Heading2>
      
      <div className="mt-6 space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <BodyMedium className="text-gray-300">
            <strong>Current User:</strong> {user ? user.email : 'Not signed in'}
          </BodyMedium>
          <BodyMedium className="text-gray-300">
            <strong>Session:</strong> {session ? 'Active' : 'None'}
          </BodyMedium>
        </div>

        <div className="flex space-x-4">
          <Button onClick={runTests} disabled={loading}>
            {loading ? 'Running Tests...' : 'Run Connection Tests'}
          </Button>
          <Button onClick={signInTest} variant="secondary">
            Test Sign In
          </Button>
          <Button onClick={signUpTest} variant="secondary">
            Test Sign Up
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="mt-6">
            <Heading2>Test Results</Heading2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{result.status}</span>
                    <span className="text-gray-300">{result.test}</span>
                  </div>
                  <BodyMedium className="text-gray-400 mt-1">
                    {result.details}
                  </BodyMedium>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-900 p-4 rounded-lg">
          <Heading2>Next Steps</Heading2>
          <BodyMedium className="text-gray-300 mt-2">
            1. Run the database schema in Supabase SQL Editor<br/>
            2. Test authentication flow<br/>
            3. Verify real-time subscriptions<br/>
            4. Check Row Level Security policies
          </BodyMedium>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest; 