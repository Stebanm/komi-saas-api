import { Body, Controller, Get, Post, UseFilters, UseInterceptors } from "@nestjs/common";

import { AllExceptionsFilter, ResponseInterceptor, ResponseMessage } from "@/shared";

import { CreateInventoryItemUseCase } from "../../application";
import { CreateInventoryItemDto } from "./dto";

@UseInterceptors(ResponseInterceptor)
@UseFilters(AllExceptionsFilter)
@Controller('inventory/item')
export class InventoryItemController {
    constructor(
        private readonly createitem: CreateInventoryItemUseCase,
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


    @Get(':id')
    public findOne() { };


    @Get(':id')
    public update() { };


    // private requireTenant() { };
};