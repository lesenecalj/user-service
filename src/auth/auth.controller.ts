import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login.dto';

interface RequestWithRefreshToken extends Request {
  cookies: {
    refresh_token: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // en prod seulement (HTTPS)
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    return { access_token: accessToken };
  }

  @Post('refresh')
  refreskToken(@Req() req: RequestWithRefreshToken) {
    const refreshToken = req.cookies?.refresh_token;
    const { accessToken } = this.authService.refreshToken(refreshToken);
    return { access_token: accessToken };
  }
}
