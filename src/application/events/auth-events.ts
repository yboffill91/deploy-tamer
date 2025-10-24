import { EventEmitter } from 'events';
import type { User } from '@/core';

export enum AuthEventType {
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGGED_IN = 'USER_LOGGED_IN',
}

export interface AuthEventPayload {
  user: User;
}

export const authEvents = new EventEmitter();
