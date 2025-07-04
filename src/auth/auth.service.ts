import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validatePassword(
    inputPassword: string,
    passwordUser: string,
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(inputPassword, passwordUser);
    return isPasswordValid;
  }

  generateToken(payload: { sub: string; email: string }) {
    return this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
    });
  }
}
