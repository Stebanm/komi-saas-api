import { InventoryBatchPrimitives } from "./inventory-batch-primitives";

/** Salida del lote hacia el exterior (HTTP, etc.), con valores derivados. */
export interface InventoryBatchResponse extends InventoryBatchPrimitives {
    totalCostAmount: string;
    remainingCostAmount: string;
    isExpired: boolean;
    isDepleted: boolean;
    createdAt: Date;
    updatedAt: Date;
};