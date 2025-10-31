import { Email, Role, User } from '@/core';

export const mockUsers = [
  new User('1', new Email('user1@mail.com'), 'User One', '', new Role('user')),
  new User(
    '2',
    new Email('customer1@mail.com'),
    'Customer One',
    '',
    new Role('customer')
  ),
];
