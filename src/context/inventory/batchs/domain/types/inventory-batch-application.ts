export interface CreateInventoryBatchApplicationParams {
    inventoryItemId: string;
    quantityReceived: string;
    totalCostAmount: string;
    expirationDate: string | null;
    receivedAt?: string;
};