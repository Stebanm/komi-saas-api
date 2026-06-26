

import { Money } from "@/shared";

import { CreateInventoryItemApplicationParams, InventoryItem, InventoryItemName, InventoryItemNameAlreadyExistsException, InventoryItemRepository, InventoryItemUnit } from "../../domain";


export class CreateInventoryItemUseCase {
    constructor(private readonly repository: InventoryItemRepository) { };


    public async execute(params: CreateInventoryItemApplicationParams): Promise<void> {
        const name = InventoryItemName.create(params.name);

        if (await this.repository.existsByName(name)) {
            throw new InventoryItemNameAlreadyExistsException(name.value);
        };

        const item = InventoryItem.create({
            name,
            unitOfMeasure: InventoryItemUnit.create(params.unitOfMeasure),
            costAmount: Money.of(params.costAmount),
            isPerishable: params.isPerishable
        });

        await this.repository.save(item);
    };
};
