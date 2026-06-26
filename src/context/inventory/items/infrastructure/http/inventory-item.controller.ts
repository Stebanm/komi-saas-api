import { Body, Controller, Get, Post, UseFilters, UseInterceptors } from "@nestjs/common";

import { AllExceptionsFilter, ResponseInterceptor, ResponseMessage } from "@/shared";

import { InventoryItemResponse } from "../../domain";
import { CreateInventoryItemUseCase, SearchInventoryItemUseCase } from "../../application";
import { CreateInventoryItemDto } from "./dto";

@UseInterceptors(ResponseInterceptor)
@UseFilters(AllExceptionsFilter)
@Controller('inventory/item')
export class InventoryItemController {
    constructor(
        private readonly createitem: CreateInventoryItemUseCase,
        private readonly searchItems: SearchInventoryItemUseCase,
    ) { };


    @Post()
    @ResponseMessage('Item de inventario creado exitosamente.')
    public async create(
        @Body() dto: CreateInventoryItemDto
    ) {
        await this.createitem.execute({
            name: dto.name,
            unitOfMeasure: dto.unitOfMeasure,
            costAmount: dto.costAmount,
            isPerishable: dto.isPerishable
        });
    };


    @Get()
    public async search(): Promise<InventoryItemResponse[]> {
        return this.searchItems.execute();
    };


    @Get(':id')
    public findOne() { };


    @Get(':id')
    public update() { };


    // private requireTenant() { };
};