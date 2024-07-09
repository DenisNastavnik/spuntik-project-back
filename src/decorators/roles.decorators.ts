import { SetMetadata } from '@nestjs/common';

export enum Role {
  Vendor = 'vendor',
  Customer = 'customer',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
