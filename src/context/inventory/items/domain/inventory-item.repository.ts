import { InventoryItem } from "./inventory-item.aggregate";
import { InventoryItemResponse } from "./types/inventory-item.response";

export abstract class InventoryItemRepository {
    abstract nextSkuNumber(): Promise<number>;
    abstract save(item: InventoryItem): Promise<void>;
    abstract search(): Promise<InventoryItemResponse[]>;
};