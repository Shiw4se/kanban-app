import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; boardId: string; status: string; order: number }) {

    return this.prisma.task.create({
      data: {
        title: data.title,
        status: data.status,
        order: data.order,
        board: { connect: { id: data.boardId } },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}