import { InventoryItemId, InventoryItemRepository } from "@/context/inventory/items/domain";

import { CreateInventoryBatchApplicationParams, InventoryBatch, InventoryBatchExpirationDate, InventoryBatchRepository } from "../../domain";
import { Money, Quantity } from "@/shared";


export class CreateInventoryBatchUseCase {
    constructor(
        private readonly batchRepository: InventoryBatchRepository,
        private readonly itemRepository: InventoryItemRepository,
    ) { };


    public async execute(params: CreateInventoryBatchApplicationParams): Promise<void> {
        const itemId = InventoryItemId.create(params.inventoryItemId);
        const item = await this.itemRepository.findById(itemId);

        if (item === null) {
            throw new Error('El item de inventario no existe.');
        };

        const itemData = item.toPrimitives();

        const quantityReceived = Quantity.of(params.quantityReceived);
        const totalCost = Money.of(params.totalCostAmount, itemData.costCurrency);
        const unitCost = totalCost.divide(quantityReceived.getValue());

        // El item manda: si es perecedero exige vencimiento; si no, se ignora.
        if (itemData.isPerishable && params.expirationDate === null) {
            throw new Error('Un item perecedero requiere fecha de vencimiento en el lote.');
        };

        const expirationDate =
            itemData.isPerishable && params.expirationDate !== null
                ? InventoryBatchExpirationDate.create(params.expirationDate)
                : null;

        const batch = InventoryBatch.create({
            inventoryItemId: itemId,
            quantityReceived,
            unitCost,
            expirationDate,
            receivedAt: params.receivedAt ? new Date(params.receivedAt) : new Date(),
        });

        await this.batchRepository.save(batch);
    };
};