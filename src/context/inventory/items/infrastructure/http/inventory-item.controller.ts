import { Body, Controller, Get, Post, UseFilters, UseInterceptors } from "@nestjs/common";
import { CreateInventoryItemUseCase } from "../../application/create-item/create-inventory-item.use-case";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { SearchInventoryItemUseCase } from "../../application/search-items/search-inventory-item.use-case";
import { InventoryItemResponse } from "../../domain/types/inventory-item.response";
import { ResponseMessage } from "@/shared/infrastructure/http/response-message.decorator";
import { ResponseInterceptor } from "@/shared/infrastructure/http/response.interceptor";
import { AllExceptionsFilter } from "@/shared/infrastructure/http/all-exceptions.filter";

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