import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { InventoryItem, InventoryItemId, InventoryItemName, InventoryItemRepository, InventoryItemResponse, InventoryItemSku } from "../../domain";
import { InventoryItemEntity } from "./inventory-item.entity";


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


    public async existsByName(name: InventoryItemName): Promise<boolean> {
        const count = await this.inventoryRepository
            .createQueryBuilder('item')
            .where('item.name ILIKE :name', { name: name.value })
            .getCount();

        return count > 0;
    };


    public async findById(id: InventoryItemId): Promise<InventoryItem | null> {
        const row = await this.inventoryRepository.findOne({ where: { id: id.value } });

        if (row === null) {
            return null;
        };

        return InventoryItem.fromPrimitives({
            id: row.id,
            name: row.name,
            unitOfMeasure: row.unitOfMeasure,
            costAmount: row.costAmount,
            costCurrency: row.costCurrency,
            isPerishable: row.isPerishable,
            isActive: row.isActive,
        });
    };
};
