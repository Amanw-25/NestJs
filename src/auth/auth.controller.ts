import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto'; // Assuming AuthDto is already defined properly

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log({
      dto, // You might want to remove this or modify for production
    });
    return this.authService.signup(dto); // Passing the dto to the service method
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto); // Passing the dto to the service method
  }
}
