import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express'; // Ensure you're importing from 'express'
import { JwtGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@Req() req: Request): any { // Use 'any' or a more specific type based on your user model
        return req.user; // Returns the authenticated user information
    }
}
