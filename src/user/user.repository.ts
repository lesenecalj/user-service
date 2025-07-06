import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { SignupDto } from 'src/dto/signup.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserFromEmail(email: string): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    return existingUser;
  }

  async save(dto: SignupDto): Promise<User> {
    const hashed = await bcrypt.hash(dto?.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashed,
    });

    return this.userRepository.save(user);
  }
}
