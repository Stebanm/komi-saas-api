/** Forma de salida del item hacia el exterior (HTTP, etc.). */
export interface InventoryItemResponse {
    id: string;
    // tenantId: string;
    name: string;
    unit: string;
    cost: string;
    isPerishable: boolean;
    active: boolean;
    createdAt: Date;
};