

import { Money } from "@/shared";
import { InventoryItem } from "../../domain/inventory-item.aggregate";
import { InventoryItemRepository } from "../../domain/inventory-item.repository";
import { InventoryItemSku } from "../../domain/value-object/inventory-item-sku.value-object";
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
        // TODO: Validar si el nombre ya se encuentra registrado.

        const skuNumber = await this.repository.nextSkuNumber();

        const item = InventoryItem.create({
            sku: InventoryItemSku.fromNumber(skuNumber),
            name: InventoryItemName.create(params.name),
            unitOfMeasure: InventoryItemUnit.create(params.unitOfMeasure),
            costAmount: Money.of(params.costAmount),
            isPerishable: params.isPerishable
        });

        await this.repository.save(item);
    };
};
