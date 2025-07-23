import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { UserRepository } from '../src/user/user.repository';
import { InputSignupDto } from 'src/dto/input.signup.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { v4 as uuidv4 } from 'uuid';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            getUserFromEmail: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  describe('signup', () => {
    const signupDto: InputSignupDto = {
      email: 'test@example.com',
      password: 'securepassword',
    };

    it('should create a user if email is not registered', async () => {
      userRepository.getUserFromEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({
        email: 'test@example.com',
        password: 'securepassword',
        createdAt: new Date(),
        id: uuidv4(),
      } as User);

      const result = await service.signup(signupDto);

      expect(userRepository.getUserFromEmail).toHaveBeenCalledWith(
        signupDto.email,
      );
      expect(userRepository.save).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual({ message: 'User has been created' });
    });

    it('should throw BadRequestException if email already exists', async () => {
      userRepository.getUserFromEmail.mockResolvedValue({
        id: '123',
        email: signupDto.email,
      } as User);

      await expect(service.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.getUserFromEmail).toHaveBeenCalledWith(
        signupDto.email,
      );
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
