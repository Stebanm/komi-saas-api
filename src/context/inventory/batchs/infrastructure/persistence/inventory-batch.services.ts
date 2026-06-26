import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { InventoryItemId } from "@/context/inventory/items/domain";

import { InventoryBatch, InventoryBatchRepository, InventoryBatchResponse } from "../../domain";
import { InventoryBatchEntity } from "./inventory-batch.entity";


@Injectable()
export class InventoryBatchService implements InventoryBatchRepository {
    constructor(
        @InjectRepository(InventoryBatchEntity)
        private readonly repository: Repository<InventoryBatchEntity>,
    ) { };


    public async save(batch: InventoryBatch): Promise<void> {
        const p = batch.toPrimitives();

        const row = this.repository.create({
            id: p.id,
            inventoryItemId: p.inventoryItemId,
            quantityReceived: p.quantityReceived,
            quantityRemaining: p.quantityRemaining,
            unitCostAmount: p.unitCostAmount,
            unitCostCurrency: p.unitCostCurrency,
            expirationDate: p.expirationDate ? new Date(p.expirationDate) : null,
            receivedAt: p.receivedAt,
        });

        await this.repository.save(row);
    };


    public async search(): Promise<InventoryBatchResponse[]> {
        const rows = await this.repository.find();

        return rows.map((row) => this.toResponse(row));
    };


    public async searchByItem(itemId: InventoryItemId): Promise<InventoryBatchResponse[]> {
        const rows = await this.repository.find({ where: { inventoryItemId: itemId.value } });

        return rows.map((row) => this.toResponse(row));
    };


    /** Rehidrata el agregado para que los valores derivados salgan del dominio. */
    private toResponse(row: InventoryBatchEntity): InventoryBatchResponse {
        const batch = InventoryBatch.fromPrimitives({
            id: row.id,
            inventoryItemId: row.inventoryItemId,
            quantityReceived: row.quantityReceived,
            quantityRemaining: row.quantityRemaining,
            unitCostAmount: row.unitCostAmount,
            unitCostCurrency: row.unitCostCurrency,
            expirationDate: row.expirationDate ? row.expirationDate.toISOString() : null,
            receivedAt: row.receivedAt,
        });

        return {
            ...batch.toPrimitives(),
            totalCostAmount: batch.totalCost().getAmount(),
            remainingCostAmount: batch.remainingCost().getAmount(),
            isExpired: batch.isExpired(),
            isDepleted: batch.isDepleted(),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    };
};