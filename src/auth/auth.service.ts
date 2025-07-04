import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { LoginDto } from 'src/dto/login.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.getUserFromEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidUser = await this.validatePassword(
      dto.password,
      user.password,
    );

    if (!isValidUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: '15m' },
    );

    const refreshToken = this.generateToken(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken: refreshToken,
    };
  }

  async validatePassword(
    inputPassword: string,
    passwordUser: string,
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(inputPassword, passwordUser);
    return isPasswordValid;
  }

  generateToken(
    payload: { sub: string; email: string },
    options: JwtSignOptions,
  ): string {
    return this.jwtService.sign(
      {
        sub: payload.sub,
        email: payload.email,
      },
      {
        expiresIn: options.expiresIn ? options.expiresIn : '',
      },
    );
  }

  refreshToken(token: string) {
    if (!token) throw new UnauthorizedException();

    try {
      const payload: { sub: string; email: string } =
        this.jwtService.verify(token);
      const accessToken = this.generateToken(payload, { expiresIn: '15m' });
      return { accessToken };
    } catch (error) {
      console.log({ error });
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
