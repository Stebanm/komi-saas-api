import { DomainEvent } from "@/shared";



interface InventoryItemCreatedProps {
    itemId: string;
    name: string;
    unitOfMeasure: string;
    costAmount: string;
    costCurrency: string;
    isPerishable: boolean;
    isActive: boolean;
};


export class InventoryItemCreatedEvent extends DomainEvent {
    public readonly name: string;
    public readonly unitOfMeasure: string;
    public readonly isPerishable: boolean;
    public readonly costAmount: string;
    public readonly costCurrency: string;
    public readonly isActive: boolean;

    constructor(props: InventoryItemCreatedProps) {
        super();

        this.name = props.name;
        this.unitOfMeasure = props.unitOfMeasure;
        this.isPerishable = props.isPerishable;
        this.costAmount = props.costAmount;
        this.costCurrency = props.costCurrency;
        this.isActive = props.isActive;
    };
};