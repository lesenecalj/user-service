import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { InputSignupDto } from 'src/dto/input.signup.dto';
import { OutputUserLogDto } from 'src/dto/output.user.logged.dto';
import { UserService } from './user.service';
import { OutputSignupDto } from 'src/dto/output.signup.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Signup a user' })
  @ApiBody({
    description: 'Credentials needed to signup',
    type: InputSignupDto,
  })
  @ApiResponse({ status: 201, type: OutputSignupDto })
  @HttpCode(201)
  signup(@Body() dto: InputSignupDto) {
    return this.userService.signup(dto);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get information about user Authenticated' })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user',
    type: OutputUserLogDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@Request() req: RequestWithUser) {
    return req.user;
  }
}
