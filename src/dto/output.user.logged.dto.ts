import { ApiProperty } from '@nestjs/swagger';

export class OutputUserLogDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  id: string;
}
