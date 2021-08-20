import { SetMetadata } from '@nestjs/common';
import { UserTypes } from '../constants/user-types';

export const USER_TYPE_KEY = 'userType';
export const UserType = (...userTypes: UserTypes[]) =>
  SetMetadata(USER_TYPE_KEY, userTypes);
