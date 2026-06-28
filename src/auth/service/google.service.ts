import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AuthTokenService } from 'src/shared/security/services/auth-token.service';
import { OAuth2Client } from 'google-auth-library';
import { TypedConfigService } from 'src/config/typed-config.service';
import { randomUUID } from 'crypto';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';

@Injectable()
export class GoogleService {
  private client: OAuth2Client;
  constructor(
    private readonly prisma: PrismaService,
    private readonly authTokenService: AuthTokenService,
    private readonly typedConfigService: TypedConfigService,
     private readonly bcryptSservice: BcryptService,
  ) {
    this.client = new OAuth2Client(typedConfigService.get('GOOGLE_CLIENT_ID'));
  }

  async googleLogin(idToken: string) {
    const ticker = await this.client.verifyIdToken({
      idToken,
      audience: this.typedConfigService.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticker.getPayload();

    if (!payload) throw new UnauthorizedException();

    if (!payload?.email) {
      throw new UnauthorizedException('Google account has no email');
    }

    const { sub, email, name, picture, email_verified } = payload;

    // check verified ?
    if (!email_verified) {
      throw new UnauthorizedException('Email not verified');
    }
    //find email
    let user = await this.prisma.user.findUnique({ where: { email } });

    // !ไม่มีให้สร้าง
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name ?? '',
          avatarUrl: picture,
          password: await this.bcryptSservice.hash(randomUUID()),
          googleId: sub,
        },
      });
    }
    // ออก JWT ให้เข้าระบบได้
    const accessToken = await this.authTokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...rest } = user;

    return { accessToken, user: rest };
  }
}
