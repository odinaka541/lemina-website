'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import BrandLogo from '@/components/ui/BrandLogo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `https://lemina.co/auth/confirm`
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for the magic link!')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 2
    }}>
      <div className="glass-panel" style={{
        padding: '3rem',
        width: '100%',
        maxWidth: '450px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="flex flex-col items-center justify-center">
            <BrandLogo showText={false} iconSize="w-12 h-12" className="mb-4" />
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--color-accent-primary)'
            }}>
              Investor Dashboard
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
            Access detailed company data and intelligence reports
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="investor@firm.com"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#FCA5A5',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10B981',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !email}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending Link...' : 'Send Magic Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link
            href="/"
            className="btn btn-secondary"
            style={{
              fontSize: '0.875rem',
              padding: '8px 16px',
              border: 'none'
            }}
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}