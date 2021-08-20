import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { USER_TYPE_KEY } from '../decorators/user-type.decorator';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userTypes = this.reflector.get(USER_TYPE_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    const isAuth = userTypes.some((userType) => userType === user.userType);
    if (!isAuth) {
      throw new UnauthorizedException('Unauthorized User type');
    }
    return isAuth;
  }
}
