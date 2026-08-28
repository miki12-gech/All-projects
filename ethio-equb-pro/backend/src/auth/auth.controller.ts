import { Controller } from '@nestjs/common';

@Controller('auth')
@UseGuards(JwtAuthGuard) // ይህ API የተቆለፈ ነው!
@Post('create-equb')
createEqub(@Body() data: any) {
  return this.equbService.create(data);
}
export class AuthController {}
