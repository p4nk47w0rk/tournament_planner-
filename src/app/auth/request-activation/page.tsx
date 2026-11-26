'use client'

import {useState} from 'react'

export default function RequestActivationPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/request-activation', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Senden der Email')
      }

      setSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten'
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
        <h2>✅ Email gesendet!</h2>
        <p style={{color: '#666', marginTop: '16px'}}>
          Du erhältst in Kürze eine Email mit dem Link, um dein Passwort zu setzen.
          Bitte überprüfe auch deinen Spam-Ordner.
        </p>
        <a href="/login" style={{
          display: 'inline-block',
          marginTop: '24px',
          color: '#D97757',
          textDecoration: 'none',
        }}>
          ← Zurück zum Login
        </a>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '100px auto',
      padding: '24px',
    }}>
      <h2>Admin-Account anfordern</h2>
      <p style={{color: '#666', marginBottom: '24px'}}>
        Gib deine Email-Adresse ein. Du erhältst einen Link, um dein Passwort zu setzen.
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
            Email-Adresse
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
            }}
            placeholder="admin@tournament-planner.com"
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
          {loading ? 'Wird gesendet...' : 'Email senden'}
        </button>
      </form>

      <p style={{textAlign: 'center', marginTop: '16px', fontSize: '14px'}}>
        <a href="/login" style={{color: '#D97757', textDecoration: 'none'}}>
          ← Zurück zum Login
        </a>
      </p>
    </div>
  )
}
