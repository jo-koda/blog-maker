import 'server-only'

import { connection } from 'next/server'
import { DEMO_USER_ID, db } from '@/lib/mock/db'
import { SessionUser } from '@/models/user'

// Demo session: there is no login yet, so every request acts as the seeded
// admin. `connection()` keeps callers request-time rendered, the same as a
// cookie-backed auth() would.
export async function auth(): Promise<{ user: SessionUser } | null> {
  await connection()
  const user = db.users.find(({ id }) => id === DEMO_USER_ID)
  if (!user) return null
  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  }
}
