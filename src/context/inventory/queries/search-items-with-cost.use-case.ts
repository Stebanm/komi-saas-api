import { InventoryBatchRepository } from "../batchs/domain";
import { CostSource, InventoryItemId, InventoryItemRepository, InventoryItemWithCostResponse } from "../items/domain";

export class SearchItemsWithCostUseCase {
    constructor(
        private readonly itemRepository: InventoryItemRepository,
        private readonly batchRepository: InventoryBatchRepository,
    ) { };


    public async execute(): Promise<InventoryItemWithCostResponse[]> {
        const items = await this.itemRepository.search();

        return Promise.all(items.map(async (item) => {
            const summary = await this.batchRepository.costSumaryByItem(
                InventoryItemId.create(item.id)
            );

            let effectiveCostAmount: string | null;
            let costSource: CostSource;

            if (summary.weightedAverageUnitCost !== null) {
                effectiveCostAmount = summary.weightedAverageUnitCost;
                costSource = "BATCHES";

            } else if (item.costAmount !== null && item.costAmount !== undefined) {
                effectiveCostAmount = item.costAmount;
                costSource = "STANDARD";
                
            } else {
                effectiveCostAmount = null;
                costSource = "NONE";
            };

            return {
                ...item,
                effectiveCostAmount,
                costSource,
                activeBatchCount: summary.activeBatchCount,
            };
        }));
    };
};