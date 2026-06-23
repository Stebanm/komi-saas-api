
import { InventoryItemId } from "./value-object/inventory-item-id.value-object";
import { InventoryItemName } from "./value-object/inventory-item-name.value-object";
import { InventoryItemUnit } from "./value-object/inventory-item-unit.value-object";
import { InventoryItemCreatedEvent } from "./inventory-item-created.event";
import { InventoryItemResponse } from "./types/inventory-item.response";
import { AggregateRoot, Money } from "@/shared";

export class InventoryItem extends AggregateRoot<InventoryItemId> {
    private readonly name: InventoryItemName;
    private readonly unit: InventoryItemUnit;
    private readonly isPerishable: boolean;
    private cost: Money;
    private active: boolean;
    public readonly createdAt: Date;


    private constructor(
        id: InventoryItemId,
        name: InventoryItemName,
        unit: InventoryItemUnit,
        cost: Money,
        isPerishable: boolean,
        active: boolean,
    ) {
        super(id);

        this.name = name;
        this.unit = unit;
        this.isPerishable = isPerishable;
        this.cost = cost;
        this.active = active;
        this.createdAt = new Date();
    };


    public static create(params: {
        name: InventoryItemName;
        unit: InventoryItemUnit;
        cost: Money;
        isPerishable: boolean;
    }): InventoryItem {
        const item = new InventoryItem(
            InventoryItemId.generate(),
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


    public toPrimitives(): InventoryItemResponse {
        return {
            id: this.id.value,
            name: this.name.value,
            unit: this.unit.value,
            cost: this.cost.getAmount(),
            isPerishable: this.isPerishable,
            active: this.active,
            createdAt: this.createdAt,
        };
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