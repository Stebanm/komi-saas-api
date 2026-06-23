import { IsBoolean, IsString, Min, MinLength } from "class-validator";

export class CreateInventoryItemDto {
    @IsString()
    @MinLength(2)
    name!: string;


    @IsString()
    unit!: string;


    @IsString()
    @Min(0)
    cost!: string;


    @IsBoolean()
    isPerishable!: boolean;
};