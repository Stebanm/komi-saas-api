import { Injectable, OnModuleInit } from "@nestjs/common";
import { InventoryItemRepository } from "../../domain/inventory-item.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { InventoryItemEntity } from "./inventory-item.entity";
import { Repository } from "typeorm";
import { InventoryItem } from "../../domain/inventory-item.aggregate";
import { InventoryItemSku } from "../../domain/value-object/inventory-item-sku.value-object";
import { InventoryItemResponse } from "../../domain/types/inventory-item.response";

// TypeORM nombra la secuencia de una columna @Generated('increment') como
// '<tabla>_<columna>_seq'. Si cambias el nombre de la tabla o de la columna, ajústalo aquí.
const SKU_SEQUENCE_NAME = 'inventory_items_inventory_item_sku_number_seq';
const SKU_SEQUENCE_START = 1000;

@Injectable()
export class InventoryItemService implements InventoryItemRepository, OnModuleInit {
    constructor(
        @InjectRepository(InventoryItemEntity)
        private readonly inventoryRepository: Repository<InventoryItemEntity>,
    ) { };


    /**
     * Cuando la tabla está vacía, arranca la secuencia del SKU en 1000.
     * setval(..., 1000, false) hace que el PRÓXIMO nextval entregue 1000.
     * El número lo asigna Postgres de forma atómica en cada INSERT.
     */
    public async onModuleInit(): Promise<void> {
        const [row] = await this.inventoryRepository.query<{ count: string }[]>(
            'SELECT COUNT(*) AS count FROM inventory_items',
        );

        if (row && Number(row.count) === 0) {
            await this.inventoryRepository.query(
                `SELECT setval('${SKU_SEQUENCE_NAME}', ${SKU_SEQUENCE_START}, false)`,
            );
        };
    };


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
