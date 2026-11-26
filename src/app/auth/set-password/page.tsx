'use client'

import {useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {createClient} from '@/lib/supabase/client'

export default function SetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Update user password using the recovery token
      const {error} = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setSuccess(true)
      // Redirect to login after 2 seconds
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to set password'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '24px',
        textAlign: 'center',
      }}>
        <h2>✅ Password gesetzt!</h2>
        <p>Wird weitergeleitet zur Anmeldung...</p>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '100px auto',
      padding: '24px',
    }}>
      <h2>Passwort festlegen</h2>
      <p style={{color: '#666', marginBottom: '24px'}}>
        Setze dein Passwort für den Tournament Planner Admin-Zugang.
      </p>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '8px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>
            Passwort
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
            placeholder="Mindestens 6 Zeichen"
          />
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', marginBottom: '4px', fontWeight: 500}}>
            Passwort bestätigen
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
            placeholder="Passwort wiederholen"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#D97757',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Wird gesetzt...' : 'Passwort setzen'}
        </button>
      </form>
    </div>
  )
}
