import { AllExceptionsFilter, ResponseInterceptor } from "@/shared";
import { Controller, Get, UseFilters, UseInterceptors } from "@nestjs/common";

import { SearchItemsWithCostUseCase } from "../search-items-with-cost.use-case";
import { InventoryItemWithCostResponse } from "../../items/domain";

@UseInterceptors(ResponseInterceptor)
@UseFilters(AllExceptionsFilter)
@Controller('inventory/item')
export class InventoryItemReadController {
    constructor(
        private readonly searchItemsWithCost: SearchItemsWithCostUseCase,
    ) { };


    @Get()
    public async search(): Promise<InventoryItemWithCostResponse[]> {
        return this.searchItemsWithCost.execute();
    };
};