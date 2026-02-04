import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create() {
    const hashedId = uuidv4().split('-')[0];
    return this.prisma.board.create({
      data: {
        title: 'New Board',
        hashedId: hashedId,
      },
    });
  }

  async findOne(hashedId: string) {
    const board = await this.prisma.board.findUnique({
      where: { hashedId },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${hashedId} not found`);
    }

    return board;
  }
}