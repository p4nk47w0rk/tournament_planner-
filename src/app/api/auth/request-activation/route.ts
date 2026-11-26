/**
 * API Route: Admin Activation Request
 *
 * POST /api/auth/request-activation
 * Body: { email: string }
 *
 * Sends a password setup email via Supabase Magic Link flow.
 * The user clicks the link, sets a password, and is then logged in.
 */

import {NextResponse} from 'next/server'
import {type NextRequest} from 'next/server'
import {createClient} from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {email} = body

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {error: 'Email is required'},
        {status: 400}
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {error: 'Invalid email format'},
        {status: 400}
      )
    }

    // US4: Block arbitrary registration — only allow configured admin email
    const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    if (allowedEmail && email.toLowerCase() !== allowedEmail) {
      return NextResponse.json(
        {error: 'Registrierung nur für autorisierte Accounts möglich'},
        {status: 403}
      )
    }

    const supabase = await createClient()

    // Send magic link for password setup
    const {error} = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/verify-activation`,
      },
    })

    if (error) {
      console.error('Activation request error:', error.message)
      return NextResponse.json(
        {error: error.message},
        {status: 500}
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Activation email sent. Check your inbox.',
    })
  } catch (error) {
    console.error('Activation request failed:', error)
    return NextResponse.json(
      {error: 'Internal server error'},
      {status: 500}
    )
  }
}
