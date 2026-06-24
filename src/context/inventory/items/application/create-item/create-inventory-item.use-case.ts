

import { Money } from "@/shared";
import { InventoryItem } from "../../domain/inventory-item.aggregate";
import { InventoryItemRepository } from "../../domain/inventory-item.repository";
import { InventoryItemName } from "../../domain/value-object/inventory-item-name.value-object";
import { InventoryItemUnit } from "../../domain/value-object/inventory-item-unit.value-object";


export interface CreateInventoryItemInput {
    name: string;
    unitOfMeasure: string;
    costAmount: string;
    isPerishable: boolean;
};


export class CreateInventoryItemUseCase {
    constructor(private readonly repository: InventoryItemRepository) { };


    public async execute(params: CreateInventoryItemInput): Promise<void> {
        const name = InventoryItemName.create(params.name);

        // TODO: Validar si el nombre ya se encuentra registrado.

        const item = InventoryItem.create({
            name,
            unitOfMeasure: InventoryItemUnit.create(params.unitOfMeasure),
            costAmount: Money.of(params.costAmount),
            isPerishable: params.isPerishable
        });

        await this.repository.save(item);
    };
};