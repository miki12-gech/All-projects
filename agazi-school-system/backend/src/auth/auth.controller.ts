import { Body, Controller, Post, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * Login endpoint
   */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Change password (authenticated users)
   * Students can change their own password
   */
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, dto);
  }

  /**
   * Admin reset password endpoint
   * Only admins can reset passwords for other users
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('reset-password/:userId')
  adminResetPassword(
    @Param('userId') userId: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.authService.adminResetPassword(userId, newPassword);
  }

  /**
   * Get current user profile
   */
  @UseGuards(JwtAuthGuard)
  @Post('me')
  async getProfile(@Req() req: any) {
    return this.authService.validateUser(req.user.userId);
  }
}
