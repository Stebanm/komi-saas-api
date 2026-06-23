import { Controller, Get } from "@nestjs/common";

@Controller('inventory/item')
export class InventoryItemController {
    constructor() { };


    public create() { };


    public search() { };


    @Get(':id')
    public findOne() { };


    @Get(':id')
    public update() { };


    private requireTenant() { };
};