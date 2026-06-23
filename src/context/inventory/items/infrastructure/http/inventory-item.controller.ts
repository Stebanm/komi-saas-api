import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateInventoryItemUseCase } from "../../application/create-item/create-inventory-item.use-case";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";

@Controller('inventory/item')
export class InventoryItemController {
    constructor(
        private readonly createitem: CreateInventoryItemUseCase
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


    public search() { };


    @Get(':id')
    public findOne() { };


    @Get(':id')
    public update() { };


    private requireTenant() { };
};