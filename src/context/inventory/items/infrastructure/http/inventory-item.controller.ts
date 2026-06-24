import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateInventoryItemUseCase } from "../../application/create-item/create-inventory-item.use-case";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { SearchInventoryItemUseCase } from "../../application/search-items/search-inventory-item.use-case";
import { InventoryItemResponse } from "../../domain/types/inventory-item.response";

@Controller('inventory/item')
export class InventoryItemController {
    constructor(
        private readonly createitem: CreateInventoryItemUseCase,
        private readonly searchItems: SearchInventoryItemUseCase,
    ) { };


    @Post()
    public async create(
        @Body() dto: CreateInventoryItemDto
    ) {
        await this.createitem.execute({
            name: dto.name,
            unit: dto.unit,
            cost: dto.cost,
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