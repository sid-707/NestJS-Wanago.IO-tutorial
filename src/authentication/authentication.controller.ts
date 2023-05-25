import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import LoginDto from './dto/login.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @Post('register')
  async register(@Body() registrationDto: RegisterDto) {
    return this.authenticationService.register(registrationDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwt(user.id);
    response.setHeader('Set-Cookie', cookie);
    return response.send(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authenticationService.login(
      loginDto.email,
      loginDto.password,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() _request: RequestWithUser, @Res() response: Response) {
    console.log('logout');
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }
}
