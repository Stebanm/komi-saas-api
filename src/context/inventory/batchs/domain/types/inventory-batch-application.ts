export interface CreateInventoryBatchApplicationParams {
    inventoryItemId: string;
    quantityReceived: string;
    unitCostAmount: string;
    expirationDate: string | null;
    receivedAt?: string;
};