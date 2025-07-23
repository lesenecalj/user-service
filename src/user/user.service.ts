import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InputSignupDto } from 'src/dto/input.signup.dto';
import { UserRepository } from './user.repository';
import { OutputSignupDto } from 'src/dto/output.signup.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger('UserService');
  }

  async signup(dto: InputSignupDto): Promise<OutputSignupDto> {
    this.logger.log(`Sign up for ${dto.email}`);
    const existingUser = await this.userRepository.getUserFromEmail(dto?.email);

    if (existingUser) {
      this.logger.error(`Email ${dto.email} already registered`);
      throw new BadRequestException('Email already registered');
    }

    const user = await this.userRepository.save(dto);
    return OutputSignupDto.fromEntity(user);
  }

  async getUserFromEmail(email: string): Promise<User> {
    const existingUser = await this.userRepository.getUserFromEmail(email);
    if (!existingUser) {
      throw new NotFoundException(`email ${email} wasn't found`);
    }
    return existingUser;
  }
}
