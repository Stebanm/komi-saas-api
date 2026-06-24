import { IsBoolean, IsString, MinLength } from "class-validator";

export class CreateInventoryItemDto {
    @IsString()
    @MinLength(2)
    name!: string;


    @IsString()
    unitOfMeasure!: string;


    @IsString()
    costAmount!: string;


    @IsBoolean()
    isPerishable!: boolean;
};