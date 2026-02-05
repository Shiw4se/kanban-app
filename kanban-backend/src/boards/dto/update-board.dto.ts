import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBoardDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}