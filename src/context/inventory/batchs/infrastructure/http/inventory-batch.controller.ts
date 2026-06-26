import { Body, Controller, Get, Post, UseFilters, UseInterceptors } from "@nestjs/common";

import { AllExceptionsFilter, ResponseInterceptor, ResponseMessage } from "@/shared";

import { InventoryBatchResponse } from "../../domain";
import { CreateInventoryBatchUseCase, SearchInventoryBatchUseCase } from "../../application";
import { CreateInventoryBatchDto } from "./dto/create-inventory-batch.dto";


@UseInterceptors(ResponseInterceptor)
@UseFilters(AllExceptionsFilter)
@Controller('inventory/batch')
export class InventoryBatchController {
    constructor(
        private readonly createBatch: CreateInventoryBatchUseCase,
        private readonly searchBatches: SearchInventoryBatchUseCase,
    ) { };


    @Post()
    @ResponseMessage('Lote de inventario registrado exitosamente.')
    public async create(
        @Body() dto: CreateInventoryBatchDto
    ): Promise<void> {
        await this.createBatch.execute({
            inventoryItemId: dto.inventoryItemId,
            quantityReceived: dto.quantityReceived,
            totalCostAmount: dto.totalCostAmount,
            expirationDate: dto.expirationDate ?? null,
            ...(dto.receivedAt ? { receivedAt: dto.receivedAt } : {}),
        });
    };


    @Get()
    public async search(): Promise<InventoryBatchResponse[]> {
        return this.searchBatches.execute();
    };
};