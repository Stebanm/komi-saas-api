import { Module } from "@nestjs/common";
import { InventoryItemModule } from "./items/inventory-items.module";

@Module({
    imports: [InventoryItemModule],
})

export class InventoryModule { };