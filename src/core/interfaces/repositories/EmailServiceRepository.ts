import { Email } from '@/core';

export interface EmailServiceRepository {
  send(email: Email): Promise<void>;
}
