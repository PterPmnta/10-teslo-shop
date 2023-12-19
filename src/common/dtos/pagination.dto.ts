import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    offset?: number;
}
