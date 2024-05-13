import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserCertificationDto {
  @ApiProperty({
    example: '56707ddc-4a18-49c2-91f7-ae1f0a029659',
    description: 'user_id',
  })
  userId: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzII6IkpXVCJ9.eyJzdWIiOiIxM3ODkwIiwibmkDIyfQ.SflKxwRJSMeKK4fwpssw5c',
    description: 'access_token',
  })
  @IsString()
  accessToken: string;

  private constructor(userId: string, accessToken: string) {
    this.userId = userId;
    this.accessToken = accessToken;
  }

  public static create({ userId, accessToken }): UserCertificationDto {
    return new UserCertificationDto(userId, accessToken);
  }
}
