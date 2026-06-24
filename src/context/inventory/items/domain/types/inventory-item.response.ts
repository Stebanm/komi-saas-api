/** Forma de salida del item hacia el exterior (HTTP, etc.). */
export interface InventoryItemResponse {
    id: string;
    // tenantId: string;
    name: string;
    unitOfMeasure: string;
    costAmount: string;
    costCurrency: string;
    isPerishable: boolean;
    isActive: boolean;
};