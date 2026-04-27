import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  // Auth endpoints: stricter limit — 10 attempts per minute per IP
  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @ApiOperation({ summary: 'Login and receive JWT token' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'Returns access_token', schema: { example: { access_token: 'eyJhbGci...' } } })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests — try again in a minute' })
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @ApiOperation({ summary: 'Get current authenticated user from token' })
  @ApiResponse({ status: 200, description: 'JWT payload of current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: { user: unknown }) {
    return req.user;
  }
}
