import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/dto/login.dto';
import { SignupDto } from 'src/dto/signup.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userRepository.getUserFromEmail(dto?.email);

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    await this.userRepository.save(dto);

    return { message: 'User has been created' };
  }

  async login(dto: LoginDto) {
    const user = await this.getUserFromEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidUser = await this.authService.validatePassword(
      dto.password,
      user.password,
    );

    if (!isValidUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.authService.sign({ sub: user.id, email: user.email });
    return {
      access_token: token,
    };
  }

  async getUserFromEmail(email: string) {
    const existingUser = await this.userRepository.getUserFromEmail(email);
    return existingUser;
  }
}
