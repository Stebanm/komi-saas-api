/** Forma de salida del item hacia el exterior (HTTP, etc.). */
export interface InventoryItemResponse {
    id: string;
    // tenantId: string;
    name: string;
    unit: string;
    cost: { amount: string; currency: string };
    isPerishable: boolean;
    isActive: boolean;
};