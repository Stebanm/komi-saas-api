import { Module } from "@nestjs/common";

import { SearchItemsWithCostUseCase } from "./search-items-with-cost.use-case";
import { InventoryItemModule } from "../items/inventory-items.module";
import { InventoryBatchModule } from "../batchs/inventory-batchs.module";
import { InventoryItemRepository } from "../items/domain";
import { InventoryBatchRepository } from "../batchs/domain";
import { InventoryItemReadController } from "./http/inventory-item.controller";


@Module({
    imports: [InventoryItemModule, InventoryBatchModule],
    controllers: [InventoryItemReadController],
    providers: [
        {
            provide: SearchItemsWithCostUseCase,
            useFactory: (
                itemRepository: InventoryItemRepository,
                batchRepository: InventoryBatchRepository,
            ) => new SearchItemsWithCostUseCase(itemRepository, batchRepository),
            inject: [InventoryItemRepository, InventoryBatchRepository]
        }
    ]
})

export class InventoryQueriesModule { };