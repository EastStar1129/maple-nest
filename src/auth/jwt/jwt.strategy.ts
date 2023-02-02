import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Payload } from './jwt.payload';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.usersRepository.findUserByIdWithoutPassword(
      payload.sub,
    );

    if (user) {
      return user; //request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
