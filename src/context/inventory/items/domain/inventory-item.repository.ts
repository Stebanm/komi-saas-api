import { InventoryItem } from "./inventory-item.aggregate";
import { InventoryItemResponse } from "./types/inventory-item.response";
import { InventoryItemId } from "./value-object";
import { InventoryItemName } from "./value-object/inventory-item-name.value-object";

export abstract class InventoryItemRepository {
    abstract save(item: InventoryItem): Promise<void>;
    abstract search(): Promise<InventoryItemResponse[]>;
    abstract findById(id: InventoryItemId): Promise<InventoryItem | null>;
    abstract existsByName(name: InventoryItemName): Promise<boolean>;
};