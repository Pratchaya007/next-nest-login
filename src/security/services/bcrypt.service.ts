import { Injectable } from '@nestjs/common';
import { TypedConfigService } from 'src/config/typed-config.service';
import bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor(private readonly typedCofigService: TypedConfigService) {}

  hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.typedCofigService.get('SALT_ROUNDS'));
  }

  compare(data: string, digest: string): Promise<boolean> {
    return bcrypt.compare(data, digest);
  }
}
