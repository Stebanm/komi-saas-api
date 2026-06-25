import { InventoryItemPrimitives } from "./inventory-item-primitives";

/** Forma de salida del item hacia el exterior (HTTP, etc.). */
export interface InventoryItemResponse extends InventoryItemPrimitives {
    createdAt: Date;
    updatedAt: Date;
};