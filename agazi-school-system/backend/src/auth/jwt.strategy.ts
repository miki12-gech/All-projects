import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token-ን ከ Header ውስጥ ፈልግ
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'AgaziSecretKey123',
    });
  }

  async validate(payload: any) {
    // Token-ኑ ትክክል ከሆነ፣ የተጠቃሚውን መረጃ እዚህ እናገኛለን
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      profileId: payload.profileId ?? null,
    };
  }
}
