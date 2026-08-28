import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Tokenኑን ከ Header ላይ ይወስዳል
      ignoreExpiration: false, // Tokenኑ ጊዜው ካለፈ ውድቅ ያደርጋል
      secretOrKey: 'SUPER_SECRET_KEY_ETHIOPIA', // ይህ ሚስጥር መሆን አለበት!
    });
  }

  async validate(payload: any) {
    // እዚህ ጋር Tokenኑ ውስጥ ያለውን መረጃ እናወጣለን
    return { userId: payload.sub, phone: payload.phone };
  }
}
