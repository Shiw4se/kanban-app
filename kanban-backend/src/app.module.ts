import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- Импорт
import { TasksModule } from './tasks/tasks.module';
import { BoardsModule } from './boards/boards.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TasksModule,
    BoardsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}