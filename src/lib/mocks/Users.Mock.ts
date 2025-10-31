import { Email, User } from '@/core';

export const mockUsers = [
  new User('1', new Email('user1@mail.com'), 'User One', ''),
  new User(
    '2',
    new Email('customer1@mail.com'),
    'Customer One',
    ''
    // new Role('customer')
  ),
];
