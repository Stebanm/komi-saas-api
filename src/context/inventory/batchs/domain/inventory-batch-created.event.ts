import { DomainEvent } from "@/shared";
import { InventoryBatchCreatedProps } from "./types";


export class InventoryBatchCreatedEvent extends DomainEvent {
    public readonly batchId: string;
    public readonly inventoryItemId: string;
    public readonly quantityReceived: string;
    public readonly unitCostAmount: string;
    public readonly unitCostCurrency: string;
    public readonly expirationDate: string | null;
    public readonly receivedAt: Date;


    constructor(props: InventoryBatchCreatedProps) {
        super();

        this.batchId = props.batchId;
        this.inventoryItemId = props.inventoryItemId;
        this.quantityReceived = props.quantityReceived;
        this.unitCostAmount = props.unitCostAmount;
        this.unitCostCurrency = props.unitCostCurrency;
        this.expirationDate = props.expirationDate;
        this.receivedAt = props.receivedAt;
    };
};