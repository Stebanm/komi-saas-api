import { Module } from "@nestjs/common";
import { InventoryItemModule } from "./items/inventory-items.module";
import { InventoryBatchModule } from "./batchs/inventory-batchs.module";
import { InventoryQueriesModule } from "./queries/inventory-queries.module";

@Module({
    imports: [
        InventoryItemModule, 
        InventoryBatchModule,
        InventoryQueriesModule
    ],
})

export class InventoryModule { };