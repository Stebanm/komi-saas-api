import { Money, Quantity } from "@/shared";

import { InventoryBatchRepository } from "../batchs/domain";
import { InventoryItemId, InventoryItemRepository } from "../items/domain";
import { InventoryStockResponse, StockStatus } from "./types/inventory-stock.response";

export class SearchStockUseCase {
    constructor(
        private readonly itemRepository: InventoryItemRepository,
        private readonly batchRepository: InventoryBatchRepository,
    ) { };


    public async execute(): Promise<InventoryStockResponse[]> {
        const items = await this.itemRepository.search();

        return Promise.all(
            items.map(async (item) => {
                const summary = await this.batchRepository.costSumaryByItem(
                    InventoryItemId.create(item.id)
                );

                const currentStock = Quantity.of(summary.totalRemainingQuantity);
                const status: StockStatus = currentStock.isZero()
                    ? "OUT_OF_STOCK"
                    : "IN_STOCK";

                // Valuación = cantidad × costo ponderado (si hay lotes activos).
                let inventoryValueAmount: string | null = null;

                if (summary.weightedAverageUnitCost !== null) {
                    inventoryValueAmount = Money
                        .of(summary.weightedAverageUnitCost, item.costCurrency)
                        .multiply(currentStock.getValue())
                        .getAmount();
                };

                return {
                    inventoryItemId: item.id,
                    itemName: item.name,
                    unitOfMeasure: item.unitOfMeasure,
                    currentStock: currentStock.getValue(),
                    activeBatchCount: summary.activeBatchCount,
                    effectiveCostAmount: summary.weightedAverageUnitCost,
                    inventoryValueAmount,
                    status,
                };
            })
        );
    };
};