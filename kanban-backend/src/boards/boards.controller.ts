import { Controller, Get, Post, Param } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create() {
    return this.boardsService.create();
  }

  @Get(':hashedId')
  findOne(@Param('hashedId') hashedId: string) {
    return this.boardsService.findOne(hashedId);
  }
}