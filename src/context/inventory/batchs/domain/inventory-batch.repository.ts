import { InventoryItemId } from "../../items/domain";

import { BatchCostSummary, InventoryBatchResponse } from "./types";
import { InventoryBatch } from "./inventory-batch.aggregate";


export abstract class InventoryBatchRepository {
    abstract save(batch: InventoryBatch): Promise<void>;
    abstract search(): Promise<InventoryBatchResponse[]>;
    abstract searchByItem(itemId: InventoryItemId): Promise<InventoryBatchResponse[]>;
    abstract costSumaryByItem(itemId: InventoryItemId): Promise<BatchCostSummary>;
};