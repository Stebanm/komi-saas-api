import { InventoryItem } from "./inventory-item.aggregate";

export abstract class InventoryItemRepository {
    abstract save(item: InventoryItem): Promise<void>;
    abstract search(): Promise<InventoryItem[]>;
};