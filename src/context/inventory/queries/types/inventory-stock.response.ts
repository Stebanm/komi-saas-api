export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK";

export interface InventoryStockResponse {
    inventoryItemId: string;
    itemName: string;
    unitOfMeasure: string;
    // branchId: string; // LISTO: descomentar cuando exista el contexto de branches
    currentStock: string;           // Σ quantityRemaining de lotes activos
    activeBatchCount: number;
    effectiveCostAmount: string | null;  // costo ponderado de lo que hay en bodega
    inventoryValueAmount: string | null; // currentStock × effectiveCost (valuación)
    status: StockStatus;
};