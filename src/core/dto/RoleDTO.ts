export interface RoleDTO {
  id: string;
  name: string;
  permissions: {
    feature: string;
    access: 'read' | 'write' | 'full';
  }[];
}
