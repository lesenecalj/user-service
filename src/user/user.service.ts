import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from 'src/dto/signup.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userRepository.getUserFromEmail(dto?.email);

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    await this.userRepository.save(dto);

    return { message: 'User has been created' };
  }
}
