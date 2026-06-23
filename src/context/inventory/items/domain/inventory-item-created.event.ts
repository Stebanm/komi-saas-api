import { DomainEvent } from "src/shared/domain/domain-event";


interface InventoryItemCreatedProps {
    itemId: string;
    name: string;
    unit: string;
    isPerishable: boolean;
    cost: { amount: string; currency: string };
    active: boolean;
}


export class InventoryItemCreatedEvent extends DomainEvent {
    public readonly name: string;
    public readonly unit: string;
    public readonly isPerishable: boolean;
    public readonly cost: { amount: string; currency: string };
    public readonly active: boolean;

    constructor(props: InventoryItemCreatedProps) {
        super();

        this.name = props.name;
        this.unit = props.unit;
        this.isPerishable = props.isPerishable;
        this.cost = props.cost;
        this.active = props.active;
    };
};