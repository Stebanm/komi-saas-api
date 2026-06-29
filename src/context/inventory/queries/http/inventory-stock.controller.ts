import { Controller, Get, UseFilters, UseInterceptors } from "@nestjs/common";

import { AllExceptionsFilter, ResponseInterceptor } from "@/shared";
import { SearchStockUseCase } from "../search-stock.use-case";
import { InventoryStockResponse } from "../types/inventory-stock.response";


@UseInterceptors(ResponseInterceptor)
@UseFilters(AllExceptionsFilter)
@Controller('inventory/stock')
export class InventoryStockController {
    constructor(
        private readonly searchStock: SearchStockUseCase,
    ) { };


    @Get()
    public async search(): Promise<InventoryStockResponse[]> {
        return this.searchStock.execute();
    };
};