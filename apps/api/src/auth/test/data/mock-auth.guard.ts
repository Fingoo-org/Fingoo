import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { User } from '@supabase/supabase-js';

export const mockUser: User = {
  id: '1',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@gmail.com',
  email_confirmed_at: '2024-05-05T10:58:28.449443Z',
  phone: '',
  confirmed_at: '2024-05-05T10:58:28.449443Z',
  last_sign_in_at: '2024-05-06T01:55:13.746322Z',
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    email: 'test@gmail.com',
    email_verified: false,
    phone_verified: false,
    sub: '1',
  },
  identities: [
    {
      identity_id: 'aa25b994-3856-4732-9bf8-a30cfa7dd0c1',
      id: '1',
      user_id: '1',
      identity_data: {
        email: 'test@gmail.com',
        email_verified: false,
        phone_verified: false,
        sub: '1',
      },
      provider: 'email',
      last_sign_in_at: '2024-05-05T10:58:28.446291Z',
      created_at: '2024-05-05T10:58:28.446342Z',
      updated_at: '2024-05-05T10:58:28.446342Z',
    },
  ],
  created_at: '2024-05-05T10:58:28.442491Z',
  updated_at: '2024-05-06T01:55:13.751643Z',
  is_anonymous: false,
};

export const mockAuthorization: string = 'MockBearer mockingAccessToken';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): Observable<boolean> {
    request.user = mockUser;
    request.headers.authorization = mockAuthorization;
    return of(true);
  }
}
