import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
  }): Promise<{ userId: string; email: string }> {
    const user = await this.userService.getUserFromEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
