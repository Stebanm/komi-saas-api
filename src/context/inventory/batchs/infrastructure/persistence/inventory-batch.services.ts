import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { InventoryItemId } from "@/context/inventory/items/domain";

import { BatchCostSummary, InventoryBatch, InventoryBatchRepository, InventoryBatchResponse } from "../../domain";
import { InventoryBatchEntity } from "./inventory-batch.entity";
import { Money, Quantity } from "@/shared";


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


    public async costSumaryByItem(itemId: InventoryItemId): Promise<BatchCostSummary> {
        const rows = await this.repository.find({
            where: { inventoryItemId: itemId.value }
        });

        const now = new Date();

        let totalValue = Money.zero('COP');     // Σ (unitCost × remaining)
        let totalQuantity = Quantity.zero();    // Σ remaining
        let activeBatchCount = 0;

        for (const row of rows) {
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

            // Activo = no agotado y no vencido. Es lo que de verdad hay disponible.
            if (batch.isDepleted() || batch.isExpired(now)) {
                continue;
            };

            const { quantityRemaining, unitCostAmount, unitCostCurrency } = batch.toPrimitives();

            const remaining = Quantity.of(quantityRemaining);
            const unitCost = Money.of(unitCostAmount, unitCostCurrency);

            totalValue = totalValue.add(unitCost.multiply(remaining.getValue()));
            totalQuantity = totalQuantity.add(remaining);
            activeBatchCount += 1;
        };

        if (totalQuantity.isZero()) {
            return { 
                weightedAverageUnitCost: null, 
                totalRemainingQuantity: "0",
                activeBatchCount: 0 
            };
        };

        const weighted = totalValue.divide(totalQuantity.getValue());

        return {
            weightedAverageUnitCost: weighted.getAmount(),
            totalRemainingQuantity: totalQuantity.getValue(),
            activeBatchCount,
        };
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