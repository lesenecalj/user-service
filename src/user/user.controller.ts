import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { SignupDto } from 'src/dto/signup.dto';
import { UserService } from './user.service';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.userService.signup(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: RequestWithUser) {
    return req.user;
  }
}
