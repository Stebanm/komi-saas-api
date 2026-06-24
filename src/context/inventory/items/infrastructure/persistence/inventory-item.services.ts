import { Injectable } from "@nestjs/common";
import { InventoryItemRepository } from "../../domain/inventory-item.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { InventoryItemEntity } from "./inventory-item.entity";
import { Repository } from "typeorm";
import { InventoryItem } from "../../domain/inventory-item.aggregate";

@Injectable()
export class InventoryItemService implements InventoryItemRepository {
    constructor(
        @InjectRepository(InventoryItemEntity)
        private readonly inventoryRepository: Repository<InventoryItemEntity>,
    ) { };


    public async save(item: InventoryItem): Promise<void> {
        const primitives = item.toPrimitives();

        const row = this.inventoryRepository.create({
            id: primitives.id,
            name: primitives.name,
            unitOfMeasure: primitives.unitOfMeasure,
            isPerishable: primitives.isPerishable,
            costAmount: primitives.costAmount,
            costCurrency: primitives.costCurrency,
            isActive: primitives.isActive
        });

        await this.inventoryRepository.save(row);
    };


    public async search(): Promise<InventoryItem[]> {
        const rows = await this.inventoryRepository.find();

        return rows.map((row) =>
            InventoryItem.fromPrimitives({
                id: row.id,
                name: row.name,
                unitOfMeasure: row.unitOfMeasure,
                costAmount: row.costAmount,
                costCurrency: row.costCurrency,
                isPerishable: row.isPerishable,
                isActive: row.isActive,
            })
        );
    };
};