export interface InventoryBatchCreatedProps {
    batchId: string;
    inventoryItemId: string;
    // branchId: string; // LISTO: descomentar con el contexto de branches
    quantityReceived: string;
    unitCostAmount: string;
    unitCostCurrency: string;
    expirationDate: string | null;
    receivedAt: Date;
};