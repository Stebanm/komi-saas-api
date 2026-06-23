import { AggregateRoot, Money } from "src/shared";
import { InventoryItemId } from "./value-object/inventory-item-id.value-object";
import { InventoryItemName } from "./value-object/inventory-item-name.value-object";
import { InventoryItemUnit } from "./value-object/inventory-item-unit.value-object";
import { InventoryItemCreatedEvent } from "./inventory-item-created.event";

export class InventoryItem extends AggregateRoot<InventoryItemId> {
    private readonly name: InventoryItemName;
    private readonly unit: InventoryItemUnit;
    private cost: Money;
    private readonly isPerishable: boolean;
    private active: boolean;


    private constructor(
        id: InventoryItemId,
        name: InventoryItemName,
        unit: InventoryItemUnit,
        cost: Money,
        isPerishable: boolean,
        active: boolean
    ) {
        super(id);

        this.name = name;
        this.unit = unit;
        this.isPerishable = isPerishable;
        this.cost = cost;
        this.active = active;
    };


    public static create(params: {
        id: InventoryItemId;
        name: InventoryItemName;
        unit: InventoryItemUnit;
        cost: Money;
        isPerishable: boolean;
    }): InventoryItem {
        const item = new InventoryItem(
            params.id,
            params.name,
            params.unit,
            params.cost,
            params.isPerishable,
            true
        );

        item.registerEvent(
            new InventoryItemCreatedEvent({
                itemId: item.id.value,
                name: item.name.value,
                unit: item.unit.value,
                isPerishable: item.isPerishable,
                cost: item.cost.toPrimitives(),
                active: item.active,
            })
        );

        return item;
    };


    public desactivate(): void {
        if (!this.active) {
            throw new Error('El item se encuentra desactivado.');
        };

        this.active = false;
    };


    public activate(): void {
        if (this.active) {
            throw new Error('El item se encuentra activado.');
        };

        this.active = true;
    };

};