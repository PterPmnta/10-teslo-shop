import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
    @ApiProperty({
        default: 10,
        description: 'How many rows do you need?',
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'How many rows do you want skip?',
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}
