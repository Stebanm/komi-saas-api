

import { InventoryItemId } from "./value-object/inventory-item-id.value-object";
import { InventoryItemName } from "./value-object/inventory-item-name.value-object";
import { InventoryItemUnit } from "./value-object/inventory-item-unit.value-object";
import { InventoryItemCreatedEvent } from "./inventory-item-created.event";
import { AggregateRoot, Money } from "@/shared";
import { InventoryItemPrimitives } from "./types/inventory-item-primitives";

export class InventoryItem extends AggregateRoot<InventoryItemId> {
    private readonly name: InventoryItemName;
    private readonly unitOfMeasure: InventoryItemUnit;
    private readonly isPerishable: boolean;
    private costAmount: Money;
    private isActive: boolean;


    private constructor(
        id: InventoryItemId,
        name: InventoryItemName,
        unitOfMeasure: InventoryItemUnit,
        costAmount: Money,
        isPerishable: boolean,
        isActive: boolean,
    ) {
        super(id);

        this.name = name;
        this.unitOfMeasure = unitOfMeasure;
        this.isPerishable = isPerishable;
        this.costAmount = costAmount;
        this.isActive = isActive;
    };


    public static create(params: {
        name: InventoryItemName;
        unitOfMeasure: InventoryItemUnit;
        costAmount: Money;
        isPerishable: boolean;
    }): InventoryItem {
        const item = new InventoryItem(
            InventoryItemId.generate(),
            params.name,
            params.unitOfMeasure,
            params.costAmount,
            params.isPerishable,
            true
        );

        item.registerEvent(
            new InventoryItemCreatedEvent({
                itemId: item.id.value,
                name: item.name.value,
                unitOfMeasure: item.unitOfMeasure.value,
                costAmount: item.costAmount.getAmount(),
                costCurrency: item.costAmount.currency,
                isPerishable: item.isPerishable,
                isActive: item.isActive,
            })
        );

        return item;
    };


    public toPrimitives(): InventoryItemPrimitives {
        return {
            id: this.id.value,
            name: this.name.value,
            unitOfMeasure: this.unitOfMeasure.value,
            costAmount: this.costAmount.getAmount(),
            costCurrency: this.costAmount.currency,
            isPerishable: this.isPerishable,
            isActive: this.isActive,
        };
    };


    public static fromPrimitives(primitives: InventoryItemPrimitives): InventoryItem {
        return new InventoryItem(
            InventoryItemId.create(primitives.id),
            InventoryItemName.create(primitives.name),
            InventoryItemUnit.create(primitives.unitOfMeasure),
            Money.of(primitives.costAmount, primitives.costCurrency),
            primitives.isPerishable,
            primitives.isActive,
        );
    };


    public desactivate(): void {
        if (!this.isActive) {
            throw new Error('El item se encuentra desactivado.');
        };

        this.isActive = false;
    };


    public activate(): void {
        if (this.isActive) {
            throw new Error('El item se encuentra activado.');
        };

        this.isActive = true;
    };

};
