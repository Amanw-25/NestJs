import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // Sign up a new user
  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    // Save the new user in the database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return user; // Return the created user
    } catch (error) {
      // Handle duplicate email error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken'); // Duplicate credentials
        }
      }
      throw error; // Rethrow other errors
    }
  }

  // Sign in an existing user
  async signin(dto: AuthDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect'); // User not found
    }

    // Verify the password
    const pwMatch = await argon.verify(user.hash, dto.password);

    if (!pwMatch) {
      throw new ForbiddenException('Credentials incorrect'); // Incorrect password
    }

    delete user.hash; // Remove the password hash from the response
    const token = await this.signToken(user.id, user.email);

  // Return success message and token
  return {
    message: "User Login successfully",
    ...token, // Spread the token object to include access_token
  };
  }

  // Generate a JWT token
  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
  
    const secret = this.config.get('JWT_SECRET');
    
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m', // Token expiration time
      secret, // JWT secret
    });
  
    return {
      access_token: token, // Return the generated token in the desired format
    };
  }
}  
