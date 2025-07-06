import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { User } from '../src/user/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: '123',
    email: 'user@test.com',
    password: 'hashedPassword',
    createdAt: new Date(),
  };

  beforeEach(() => {
    userService = {
      getUserFromEmail: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    jwtService = {
      sign: jest.fn(),
    } as any;

    authService = new AuthService(userService, jwtService);

    authService['logger'] = {
      log: jest.fn(),
      error: jest.fn(),
    } as any;

    authService.validatePassword = jest.fn();
    authService.generateToken = jest.fn();
  });

  it('should return access and refresh tokens for valid login', async () => {
    userService.getUserFromEmail.mockResolvedValue(mockUser);
    (authService.validatePassword as jest.Mock).mockResolvedValue(true);
    (authService.generateToken as jest.Mock)
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await authService.login({
      email: mockUser.email,
      password: 'plainPassword',
    });

    expect(userService.getUserFromEmail).toHaveBeenCalledWith(mockUser.email);
    expect(authService.validatePassword).toHaveBeenCalledWith(
      'plainPassword',
      mockUser.password,
    );
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('should throw if user not found', async () => {
    userService.getUserFromEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'wrong@email.com',
        password: 'any',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if password is invalid', async () => {
    userService.getUserFromEmail.mockResolvedValue(mockUser);
    (authService.validatePassword as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.login({
        email: mockUser.email,
        password: 'wrongPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
