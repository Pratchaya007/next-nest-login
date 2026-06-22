import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example:
      '0a2f3d4d5a60e9cf660010594da12dab133a7f7c09658d10773fa2a7023c7545b0c5c5877721629b804ef173fe988f31a3aede877b92f4bc11aa6421f1c5c254',
  })
  accessToken!: string;

  @ApiProperty()
  user!: UserResponseDto;
}
