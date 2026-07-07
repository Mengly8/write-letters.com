'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailAuth = async () => {
    setLoading(true);
    setMessage('');
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Check your email for a confirmation link!');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        window.location.href = '/';
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div>
      <h1>Letters</h1>
      <p>Bring back the art of letter writing.</p>
      <hr />
      <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label style={{ marginTop: '10px' }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 15px',
          border: '1px solid #dcd1c4',
          borderRadius: '4px',
          backgroundColor: '#fffcf9',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.95rem',
          boxSizing: 'border-box',
        }}
      />
      {message && (
        <p style={{ color: message.includes('Check') ? 'green' : 'red', marginTop: '10px' }}>
          {message}
        </p>
      )}
      <br />
      <button onClick={handleEmailAuth} disabled={loading}>
        {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
      </button>
      <br /><br />
      <button onClick={handleGoogleSignIn} style={{ backgroundColor: '#4285f4' }}>
        Continue with Google
      </button>
      <br /><br />
      <p>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ color: '#8c7662', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </span>
      </p>
    </div>
  );
}
