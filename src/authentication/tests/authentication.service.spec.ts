import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from '../authentication.service';
import { Repository } from 'typeorm';
import User from '../../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import mockedConfigService from '../../utils/mocks/config.service';
import mockedJwtService from '../../utils/mocks/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();
    authenticationService = await module.get(AuthenticationService);
  });
  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(typeof authenticationService.getCookieWithJwt(userId)).toEqual(
        'string',
      );
    });
  });
});
