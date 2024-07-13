import { SetMetadata } from '@nestjs/common';

export enum Role {
  Vendor = 'Vendor',
  Customer = 'Customer',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
