import { Money } from "src/shared";
import { InventoryItem } from "../../domain/inventory-item.aggregate";
import { InventoryItemRepository } from "../../domain/inventory-item.repository";
import { InventoryItemName } from "../../domain/value-object/inventory-item-name.value-object";
import { InventoryItemUnit } from "../../domain/value-object/inventory-item-unit.value-object";


export interface CreateInventoryItemInput {
    name: string;
    unit: string;
    cost: string;
    isPerishable: boolean;
};


export class CreateInventoryItemUseCase {
    constructor(private readonly repository: InventoryItemRepository) { };


    public async execute(params: CreateInventoryItemInput): Promise<void> {
        const name = InventoryItemName.create(params.name);

        // TODO: Validar si el nombre ya se encuentra registrado.

        const item = InventoryItem.create({
            name,
            unit: InventoryItemUnit.create(params.unit),
            cost: Money.of(params.cost),
            isPerishable: params.isPerishable
        });

        await this.repository.save(item);
    };
};