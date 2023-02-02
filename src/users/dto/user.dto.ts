import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../users.schema';

export class ReadOnlyUserDto extends PickType(User, [
  'email',
  'name',
] as const) {
  @ApiProperty({
    example: '283921',
    description: 'id',
    required: true,
  })
  id: string;
}
