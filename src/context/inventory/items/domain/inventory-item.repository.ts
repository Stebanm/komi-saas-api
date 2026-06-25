import { InventoryItem } from "./inventory-item.aggregate";
import { InventoryItemResponse } from "./types/inventory-item.response";

export abstract class InventoryItemRepository {
    abstract save(item: InventoryItem): Promise<void>;
    abstract search(): Promise<InventoryItemResponse[]>;
};