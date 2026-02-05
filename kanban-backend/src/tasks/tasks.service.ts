import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description || '',
        status: createTaskDto.status || 'todo',
        order: createTaskDto.order || 0,
        board: { connect: { id: createTaskDto.boardId } },
      },
    });
  }

  findAll() { return this.prisma.task.findMany(); }

  findOne(id: string) { return this.prisma.task.findUnique({ where: { id } }); }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  remove(id: string) { return this.prisma.task.delete({ where: { id } }); }
}