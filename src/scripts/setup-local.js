#!/usr/bin/env node
/**
 * Create a test user in Supabase Auth
 * Run: node src/scripts/setup-local.js
 *
 * Requirements: Supabase local dev running (docker compose up -d)
 */

import {createClient} from '@supabase/ssr'
import {Cookies} from 'unplugin-cookies/node'

const SUPABASE_URL = 'http://localhost:54321'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43ddQ6ko_oNs_3n_kV4Y_v20'

// For local Supabase docker, the anon key is different
// The actual anon key from supabase docker is in the container logs
// For now, let's use a simplified approach

async function createTestUser() {
  console.log('Creating test user in Supabase...')
  console.log('Please run this with the correct SUPABASE_URL and SUPABASE_ANON_KEY')

  // This should be run via the Supabase REST API directly
  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/signup`, {
    method: 'POST',
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
      'Authorization': `Bearer your-service-role-key`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@bambini-cup.local',
      password: 'TestPassword123!',
      data: {
        display_name: 'Test User',
        role: 'editor',
      },
    }),
  })

  if (response.ok) {
    const user = await response.json()
    console.log('✅ Test user created:', user)
  } else {
    const error = await response.text()
    console.log('❌ Error:', error)
  }
}

createTestUser()
