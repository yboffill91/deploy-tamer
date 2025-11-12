import { sessionApi } from "@/lib/apis";

interface ISessionRepository {
  createSessionCookie(idToken: string | null): Promise<void>;
  deleteSessionCookie(cookie: string): Promise<void>;
}

export class SessionRepository implements ISessionRepository {
  async createSessionCookie(idToken: string | null): Promise<void> {
    if (!idToken) throw new Error("No User Id Founded");
    try {
      await fetch(sessionApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  async deleteSessionCookie(): Promise<void> {
    try {
      await fetch(`${sessionApi}/session_delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify("TS_SESSION"),
        credentials: "include",
      });
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }
}
