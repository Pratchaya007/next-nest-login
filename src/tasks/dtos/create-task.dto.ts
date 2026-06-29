import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({ example: ''})
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    example: '',
    required:false
  })
  @IsString()
  @IsOptional()
  description?: string
}