import { IsISO8601, IsOptional, IsUUID, Matches } from "class-validator";

export class CreateInventoryBatchDto {
    @IsUUID()
    inventoryItemId!: string;


    @Matches(/^\d+(\.\d{1,3})?$/, {
        message: 'quantityReceived debe ser numérico (hasta 3 decimales).'
    })
    quantityReceived!: string;


    @Matches(/^\d+(\.\d{1,2})?$/, {
        message: 'totalCostAmount debe ser numérico (hasta 2 decimales).'
    })
    totalCostAmount!: string;


    // Requerido solo si el item es perecedero; la regla se valida en el caso de uso.
    @IsOptional()
    @IsISO8601()
    expirationDate?: string;


    @IsOptional()
    @IsISO8601()
    receivedAt?: string;
};