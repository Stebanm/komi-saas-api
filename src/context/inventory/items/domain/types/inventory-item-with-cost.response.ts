import { InventoryItemResponse } from "./inventory-item.response";

export type CostSource = "BATCHES" | "STANDARD" | "NONE";

export interface InventoryItemWithCostResponse extends InventoryItemResponse {
    /** Costo vigente: promedio ponderado de lotes activos, o el estándar como fallback. */
    effectiveCostAmount: string | null;
    costSource: CostSource;
    activeBatchCount: number;
};