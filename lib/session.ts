import 'server-only'
import { cookies } from 'next/headers'
import { decrypt, encrypt } from './jwt'
import { SessionPayload } from '@/schema/common'
 
export async function createSession(userId: string, name: string, avatar: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, name, avatar, expiresAt })
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
  if(cookie) {
    const session = await decrypt(cookie);
    if(session?.expiresAt && session.expiresAt < new Date()) {
      await deleteSession();
      return null;
    }
    return session as SessionPayload;  
  }
  else {
    return null;
  }
}