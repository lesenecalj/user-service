import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SignupDto } from 'src/dto/signup.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger('UserService');
  }

  async signup(dto: SignupDto) {
    this.logger.log(`Sign up for ${dto.email}`);
    const existingUser = await this.userRepository.getUserFromEmail(dto?.email);

    if (existingUser) {
      this.logger.error(`Email ${dto.email} already registered`);
      throw new BadRequestException('Email already registered');
    }

    await this.userRepository.save(dto);

    return { message: 'User has been created' };
  }

  async getUserFromEmail(email: string) {
    const existingUser = await this.userRepository.getUserFromEmail(email);
    return existingUser;
  }
}
