import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

export class OutputSignupDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  password: string;

  constructor(partial: Partial<OutputSignupDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(user: User): OutputSignupDto {
    return new OutputSignupDto({
      id: user.id,
      email: user.email,
      password: user.password,
    });
  }
}
