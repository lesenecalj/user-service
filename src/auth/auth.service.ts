import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { InputLoginDto } from 'src/dto/input.login.dto';
import { UserService } from 'src/user/user.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private logger;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger('AuthService');
  }

  async login(
    dto: InputLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(`Login attempt for ${dto.email}`);
    const user = await this.userService.getUserFromEmail(dto.email);
    if (!user) {
      this.logger.error(`Invalid credentials for ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidUser = await this.validatePassword(
      dto.password,
      user.password,
    );

    if (!isValidUser) {
      this.logger.error(`Invalid credentials for ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    const refreshToken = this.generateToken(
      { sub: user.id, email: user.email },
      { expiresIn: '7d' },
    );

    this.logger.log(`Tokens generated for ${dto.email}`);

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
      { sub: payload.sub, email: payload.email },
      { expiresIn: options.expiresIn ? options.expiresIn : '15m' },
    );
  }

  refreshToken(token: string) {
    if (!token) throw new UnauthorizedException();

    try {
      const payload: { sub: string; email: string } =
        this.jwtService.verify(token);
      this.logger.log(`Refresh token for ${payload.email}`);
      const accessToken = this.generateToken(payload, { expiresIn: '15m' });
      return { accessToken };
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
