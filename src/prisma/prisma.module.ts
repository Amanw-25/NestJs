import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';



//we are making it global so any controller can import it without any import statement
@Global()
@Module({
  providers: [PrismaService],
  exports:[PrismaService]
})
export class PrismaModule {}
