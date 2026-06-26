export interface InventoryBatchPrimitives {
    id: string;
    inventoryItemId: string;
    // branchId: string; // LISTO: descomentar cuando exista el contexto de branches
    quantityReceived: string;
    quantityRemaining: string;
    unitCostAmount: string;
    unitCostCurrency: string;
    expirationDate: string | null;
    receivedAt: Date;
};