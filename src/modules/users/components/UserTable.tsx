// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import { Pencil } from 'lucide-react';
// import { RoleManagerService } from '@/core/interfaces/services/RoleManagerService';
// import { InMemoryUserRepository } from '@/infraestructure/repositories/InMemoryUserRepository';
// import { User } from '@/core';
// import { UserEditSheet } from './UserEditSheet';
// import { Card, CardContent, CardHeader } from '@/components/ui';

// const userRepo = new InMemoryUserRepository();
// const roleManager = new RoleManagerService(userRepo);

// export const UserTable: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filtered, setFiltered] = useState<User[]>([]);
//   const [search, setSearch] = useState('');
//   const [selected, setSelected] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const data = await roleManager.getAllUsers();
//       setUsers(data);
//       setFiltered(data);
//     };
//     fetchUsers();
//   }, []);

//   const handleSearch = (value: string) => {
//     setSearch(value);
//     const lower = value.toLowerCase();
//     const filteredData = users.filter(
//       (u) =>
//         (u.displayName?.toLowerCase() ?? '').includes(lower) ||
//         u.email.getValue().toLowerCase().includes(lower) ||
//         u.role.getValue().toLowerCase().includes(lower)
//     );
//     setFiltered(filteredData);
//   };

//   const handleRoleChange = (updatedUser: User) => {
//     const newUsers = users.map((u) =>
//       u.id === updatedUser.id ? updatedUser : u
//     );
//     setUsers(newUsers);
//     setFiltered(newUsers);
//     setSelected(null);
//   };

//   return (
//     <Card className='space-y-4'>
//       <CardHeader className='flex justify-between items-center'>
//         <Input
//           placeholder='Search by email, name or role'
//           value={search}
//           onChange={(e) => handleSearch(e.target.value)}
//           className='max-w-sm'
//         />
//       </CardHeader>

//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filtered.map((user) => (
//               <TableRow key={user.id}>
//                 <TableCell>{user.displayName ?? ''}</TableCell>
//                 <TableCell>{user.email.getValue()}</TableCell>
//                 <TableCell>{user.role.getValue()}</TableCell>
//                 <TableCell>
//                   <Sheet
//                     open={selected?.id === user.id}
//                     onOpenChange={() => setSelected(null)}
//                   >
//                     <SheetTrigger asChild>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         onClick={() => setSelected(user)}
//                       >
//                         <Pencil className='w-4 h-4' />
//                       </Button>
//                     </SheetTrigger>
//                     <SheetContent className='w-[400px] sm:w-[480px]'>
//                       <SheetHeader>
//                         <SheetTitle>Edit user</SheetTitle>
//                       </SheetHeader>
//                       <UserEditSheet
//                         user={selected}
//                         onSave={handleRoleChange}
//                         onCancel={() => setSelected(null)}
//                       />
//                     </SheetContent>
//                   </Sheet>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

import React from 'react';

export const UserTable = () => {
  return <div>UserTable</div>;
};
