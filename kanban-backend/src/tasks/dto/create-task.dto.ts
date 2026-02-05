import { IsString, IsOptional, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(['todo', 'in_progress', 'done'])
    status?: string;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsString()
    @IsNotEmpty()
    boardId: string;
}