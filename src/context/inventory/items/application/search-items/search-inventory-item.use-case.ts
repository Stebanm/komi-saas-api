import { InventoryItemRepository } from "../../domain/inventory-item.repository";
import { InventoryItemResponse } from "../../domain/types/inventory-item.response";

export class SearchInventoryItemUseCase {
    constructor(
        private readonly repository: InventoryItemRepository
    ) { };


    public async execute(): Promise<InventoryItemResponse[]> {
        return this.repository.search();
    };
};