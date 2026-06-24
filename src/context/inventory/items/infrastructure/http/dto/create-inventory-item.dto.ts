import { IsBoolean, IsString, MinLength } from "class-validator";

export class CreateInventoryItemDto {
    @IsString()
    @MinLength(2)
    name!: string;


    @IsString()
    unit!: string;


    @IsString()
    cost!: string;


    @IsBoolean()
    isPerishable!: boolean;
};