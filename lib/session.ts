import 'server-only'
import { cookies } from 'next/headers'
import { decrypt, encrypt } from './jwt'
import { SessionPayload } from '@/schema/common'
 
export async function createSession(userId: string, name: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, name, expiresAt })
  const cookieStore = await cookies()
 
  cookieStore.set('_feast_session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('_feast_session');
}

export const getSession = async () => {
  const cookie = (await cookies()).get('_feast_session')?.value;
  const session = await decrypt(cookie);
  return session as SessionPayload
}