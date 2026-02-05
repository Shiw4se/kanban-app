import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
    @IsString()
    @IsNotEmpty()
    id: string;
    @IsString()
    @IsNotEmpty()
    title: string;
}