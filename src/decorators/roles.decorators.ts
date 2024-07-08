import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (roles: 'Customer' | 'Vendor') => SetMetadata(ROLES_KEY, roles);
