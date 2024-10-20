import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config'; // Correct import from '@nestjs/config'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'), // Correctly fetching the DATABASE_URL
        },
      },
    });
    
    // Corrected the typo here
    console.log(config.get('DATABASE_URL'));
  }
}
