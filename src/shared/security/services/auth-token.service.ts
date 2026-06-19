import { Injectable } from '@nestjs/common';
import { TypedConfigService } from 'src/config/typed-config.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly typedConfigService: TypedConfigService,
    private readonly jwtService: JwtService,
  ) {}
  //generate Token
  sign(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.typedConfigService.get('JWT_SECRET'),
      expiresIn: this.typedConfigService.get('JWT_EXPIRES_IN'),
    });
  }

  // verify token ตรวจสอบค่าถูกต้อง
  verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.typedConfigService.get('JWT_SECRET'),
    });
  }
}
