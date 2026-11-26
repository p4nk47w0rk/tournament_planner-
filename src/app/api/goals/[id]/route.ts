/**
 * API Route: Delete a specific goal
 *
 * DELETE /api/goals/:id
 */

import {NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'

export async function DELETE(_request: Request, {params}: {params: Promise<{id: string}>}) {
  const supabase = await createClient()

  // Check authentication
  const {data: {user}} = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      {error: 'Unauthorized'},
      {status: 401}
    )
  }

  const {id} = await params

  const {error} = await supabase
    .from('goals')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    console.error('Delete goal error:', error)
    return NextResponse.json(
      {error: error.message},
      {status: 500}
    )
  }

  return NextResponse.json({success: true})
}
