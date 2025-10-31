// 'use client';

// import React, { useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { User } from '@/core';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { userRoleSchema, UserRoleForm } from './models/UserRoleSchema';

// interface Props {
//   user: User | null;
//   onSave: (updatedUser: User) => void;
//   onCancel: () => void;
// }

// export const UserEditSheet: React.FC<Props> = ({ user, onSave, onCancel }) => {
//   const { control, handleSubmit, reset } = useForm<UserRoleForm>({
//     resolver: zodResolver(userRoleSchema),
//     defaultValues: { role: user?.role.getValue() ?? 'user' },
//   });

//   // Actualizamos el formulario cuando cambia el usuario seleccionado
//   useEffect(() => {
//     reset({ role: user?.role.getValue() ?? 'user' });
//   }, [user, reset]);

//   const submitForm = (data: UserRoleForm) => {
//     if (!user) return;
//     // Usamos el método de la entidad para actualizar correctamente el Role
//     const updatedUser = user.updateRole(data.role);
//     onSave(updatedUser);
//   };

//   if (!user) return null;

//   return (
//     <form
//       onSubmit={handleSubmit(submitForm)}
//       className='flex flex-col gap-4 py-4'
//     >
//       <div>
//         <Label className='text-sm text-muted-foreground'>Nombre</Label>
//         <p>{user.displayName ?? ''}</p>
//       </div>

//       <div>
//         <Label className='text-sm text-muted-foreground'>Email</Label>
//         <p>{user.email.getValue()}</p>
//       </div>

//       <div>
//         <Label>Rol</Label>
//         <Controller
//           name='role'
//           control={control}
//           render={({ field }) => (
//             <Select value={field.value} onValueChange={field.onChange}>
//               <SelectTrigger>
//                 <SelectValue placeholder='Seleccionar rol' />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value='user'>User</SelectItem>
//                 <SelectItem value='customer'>Customer</SelectItem>
//                 <SelectItem value='admin'>Admin</SelectItem>
//               </SelectContent>
//             </Select>
//           )}
//         />
//       </div>

//       <div className='flex justify-end gap-2'>
//         <Button type='button' variant='outline' onClick={onCancel}>
//           Cancelar
//         </Button>
//         <Button type='submit'>Guardar</Button>
//       </div>
//     </form>
//   );
// };

import React from 'react';

export const UserEditSheet = () => {
  return <div>UserEditSheet</div>;
};
