import { ResponseUsersDTO } from '@/core';
import { getTokenApi, sessionApi } from '@/lib/apis';
import { fetchHelper } from '@/lib/fetch-helper';

interface ISessionRepository {
  createSessionCookie(
    idToken: string | null,
    cookie: string | null
  ): Promise<void>;
  deleteSessionCookie(cookie: string): Promise<void>;
  getToken(): Promise<string>;
  autorization(): Promise<string>;
}

export class SessionRepository implements ISessionRepository {
  async createSessionCookie(
    idToken: string | null,
    cookie: string | null
  ): Promise<void> {
    if (!idToken) throw new Error('No User Id Founded');
    try {
      await fetch(sessionApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, cookie }),
        credentials: 'include',
      });
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  async deleteSessionCookie(): Promise<void> {
    try {
      await fetch(`${sessionApi}/session_delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify('TS_SESSION'),
        credentials: 'include',
      });
      await fetch(`${sessionApi}/session_delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify('TS_USER'),
        credentials: 'include',
      });
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }
  async getToken(): Promise<string> {
    try {
      const tokenFromCookie = await fetchHelper<{
        success: boolean;
        token: {
          name: string;
          value: string;
        };
      }>(getTokenApi, {
        method: 'GET',
        credentials: 'include',
      });

      if (!tokenFromCookie) {
        throw new Error('Error fetching access token');
      }
      return tokenFromCookie.token.value;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  async autorization(): Promise<string> {
    const token = await this.getToken();
    return token;
  }

  async getUser(): Promise<ResponseUsersDTO | null> {
    const response = await fetchHelper<{
      success: boolean;
      user: ResponseUsersDTO;
    }>('/api/session/getUserCookie', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response || !response.success) {
      return null;
    }

    return response.user;
  }
}
