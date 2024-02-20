import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { MemberEntity } from './member.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): Observable<boolean> {
    const member: MemberEntity = { id: 1 }; // mock user
    request.member = member; // request에 유저 정보를 할당합니다.
    return of(true); // 유저가 인증되었음을 나타내는 Observable을 반환합니다.
  }
}
