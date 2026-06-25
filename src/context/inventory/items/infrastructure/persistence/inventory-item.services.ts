import { Injectable } from "@nestjs/common";
import { InventoryItemRepository } from "../../domain/inventory-item.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { InventoryItemEntity } from "./inventory-item.entity";
import { Repository } from "typeorm";
import { InventoryItem } from "../../domain/inventory-item.aggregate";
import { InventoryItemSku } from "../../domain/value-object/inventory-item-sku.value-object";
import { InventoryItemResponse } from "../../domain/types/inventory-item.response";

const SKU_SEQUENCE_START = 1000;

@Injectable()
export class InventoryItemService implements InventoryItemRepository {
    constructor(
        @InjectRepository(InventoryItemEntity)
        private readonly inventoryRepository: Repository<InventoryItemEntity>,
    ) { };


    public async nextSkuNumber(): Promise<number> {
        const result = await this.inventoryRepository
            .createQueryBuilder('item')
            .select('MAX(item.skuNumber)', 'max')
            .getRawOne<{ max: string | null }>();

        return result?.max ? parseInt(result.max) + 1 : SKU_SEQUENCE_START;
    };


    public async save(item: InventoryItem): Promise<void> {
        const primitives = item.toPrimitives();
        const skuNumber = parseInt(primitives.sku.replace('INV-', ''));

        const row = this.inventoryRepository.create({
            id: primitives.id,
            skuNumber: String(skuNumber),
            name: primitives.name,
            unitOfMeasure: primitives.unitOfMeasure,
            isPerishable: primitives.isPerishable,
            costAmount: primitives.costAmount,
            costCurrency: primitives.costCurrency,
            isActive: primitives.isActive
        });

        await this.inventoryRepository.save(row);
    };


    public async search(): Promise<InventoryItemResponse[]> {
        const rows = await this.inventoryRepository.find();

        return rows.map((row) => ({
            id: row.id,
            sku: InventoryItemSku.fromNumber(parseInt(row.skuNumber)).value,
            name: row.name,
            unitOfMeasure: row.unitOfMeasure,
            costAmount: row.costAmount,
            costCurrency: row.costCurrency,
            isPerishable: row.isPerishable,
            isActive: row.isActive,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }));
    };
};
