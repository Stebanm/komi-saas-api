import { InventoryItemRepository, InventoryItemResponse } from "../../domain";


export class SearchInventoryItemUseCase {
    constructor(
        private readonly repository: InventoryItemRepository
    ) { };


    public async execute(): Promise<InventoryItemResponse[]> {
        return this.repository.search();
    };
};