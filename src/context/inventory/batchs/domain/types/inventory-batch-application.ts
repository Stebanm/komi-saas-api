export interface CreateInventoryBatchApplicationParams {
    inventoryItemId: string;
    quantityReceived: string;
    totalCostAmount: string;
    expirationDate: string | null;
    receivedAt?: string;
};



export interface BatchCostSummary {
    /** Promedio ponderado del costo de los lotes ACTIVOS, o null si no hay. */
    weightedAverageUnitCost: string | null;
    activeBatchCount: number;
}