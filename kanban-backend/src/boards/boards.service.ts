import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto) {
    const existing = await this.prisma.board.findUnique({
      where: { id: createBoardDto.id }
    });
    if (existing) throw new ConflictException('Board ID already exists');

    return this.prisma.board.create({
      data: {
        id: createBoardDto.id,
        title: createBoardDto.title,
      },
    });
  }

  async findOne(id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: { tasks: { orderBy: { order: 'asc' } } },
    });
    if (!board) throw new NotFoundException(`Board ${id} not found`);
    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    await this.findOne(id);
    return this.prisma.board.update({
      where: { id },
      data: { title: updateBoardDto.title },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.board.delete({ where: { id } });
  }
}