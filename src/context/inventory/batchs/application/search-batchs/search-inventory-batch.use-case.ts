import { InventoryBatchRepository, InventoryBatchResponse } from "../../domain";

export class SearchInventoryBatchUseCase {
    constructor(
        private readonly repository: InventoryBatchRepository
    ) { };


    public async execute(): Promise<InventoryBatchResponse[]> {
        return this.repository.search();
    };
};