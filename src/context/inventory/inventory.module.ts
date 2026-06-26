import { Module } from "@nestjs/common";
import { InventoryItemModule } from "./items/inventory-items.module";
import { InventoryBatchModule } from "./batchs/inventory-batchs.module";

@Module({
    imports: [InventoryItemModule, InventoryBatchModule],
})

export class InventoryModule { };