import { sessionApi } from '@/lib/apis';

interface ISessionRepository {
  createSessionCookie(idToken: string | null): Promise<void>;
  deleteSessionCookie(cookie: string): Promise<void>;
}

export class SessionRepository implements ISessionRepository {
  async createSessionCookie(idToken: string | null): Promise<void> {
    if (!idToken) throw new Error('No User Id Founded');
    try {
      await fetch(sessionApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  async deleteSessionCookie(): Promise<void> {
    try {
      await fetch('http://localhost:3000/api/session/session_delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify('session'),
        credentials: 'include',
      });
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }
}
