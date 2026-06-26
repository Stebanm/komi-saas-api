import { AggregateRoot, Money, Quantity } from "@/shared";

import { InventoryItemId } from "../../items/domain";

import { InventoryBatchPrimitives } from "./types";
import { InventoryBatchCreatedEvent } from "./inventory-batch-created.event";
import { InventoryBatchExpirationDate, InventoryBatchId } from "./value-object";


export class InventoryBatch extends AggregateRoot<InventoryBatchId> {
    private readonly inventoryItemId: InventoryItemId;
    // private readonly branchId: BranchId; // LISTO: descomentar con el contexto de branches
    private readonly quantityReceived: Quantity;
    private quantityRemaining: Quantity;
    private readonly unitCost: Money;
    private readonly expirationDate: InventoryBatchExpirationDate | null;
    private readonly receivedAt: Date;


    private constructor(
        id: InventoryBatchId,
        inventoryItemId: InventoryItemId,
        quantityReceived: Quantity,
        quantityRemaining: Quantity,
        unitCost: Money,
        expirationDate: InventoryBatchExpirationDate | null,
        receivedAt: Date,
    ) {
        super(id);

        this.inventoryItemId = inventoryItemId;
        this.quantityReceived = quantityReceived;
        this.quantityRemaining = quantityRemaining;
        this.unitCost = unitCost;
        this.expirationDate = expirationDate;
        this.receivedAt = receivedAt;
    };


    public static create(params: {
        inventoryItemId: InventoryItemId;
        quantityReceived: Quantity;
        unitCost: Money;
        expirationDate: InventoryBatchExpirationDate | null;
        receivedAt?: Date;
    }): InventoryBatch {
        if (params.quantityReceived.isZero()) {
            throw new Error('La cantidad recibida del lote debe ser mayor a cero.');
        };

        const receivedAt = params.receivedAt ?? new Date();

        const batch = new InventoryBatch(
            InventoryBatchId.generate(),
            params.inventoryItemId,
            params.quantityReceived,
            params.quantityReceived, // al crear, restante = recibido
            params.unitCost,
            params.expirationDate,
            receivedAt,
        );

        batch.registerEvent(
            new InventoryBatchCreatedEvent({
                batchId: batch.id.value,
                inventoryItemId: batch.inventoryItemId.value,
                quantityReceived: batch.quantityReceived.getValue(),
                unitCostAmount: batch.unitCost.getAmount(),
                unitCostCurrency: batch.unitCost.currency,
                expirationDate: batch.expirationDate ? batch.expirationDate.toISOString() : null,
                receivedAt: batch.receivedAt,
            })
        );

        return batch;
    };


    /**
     * Descuenta cantidad de este lote (consumo / salida).
     * La SELECCIÓN de qué lote consumir (FEFO/FIFO) es responsabilidad del caso
     * de uso de movimientos; aquí solo se protege la invariante del propio lote.
     */
    public consume(quantity: Quantity): void {
        if (quantity.isGreaterThan(this.quantityRemaining)) {
            throw new Error('No hay cantidad suficiente en el lote para consumir.');
        };

        this.quantityRemaining = this.quantityRemaining.subtract(quantity);
    };


    public isExpired(at: Date = new Date()): boolean {
        return this.expirationDate ? this.expirationDate.isBefore(at) : false;
    };


    public isDepleted(): boolean {
        return this.quantityRemaining.isZero();
    };


    public totalCost(): Money {
        return this.unitCost.multiply(this.quantityReceived.getValue());
    };


    public remainingCost(): Money {
        return this.unitCost.multiply(this.quantityRemaining.getValue());
    };


    public toPrimitives(): InventoryBatchPrimitives {
        return {
            id: this.id.value,
            inventoryItemId: this.inventoryItemId.value,
            quantityReceived: this.quantityReceived.getValue(),
            quantityRemaining: this.quantityRemaining.getValue(),
            unitCostAmount: this.unitCost.getAmount(),
            unitCostCurrency: this.unitCost.currency,
            expirationDate: this.expirationDate ? this.expirationDate.toISOString() : null,
            receivedAt: this.receivedAt,
        };
    };


    public static fromPrimitives(p: InventoryBatchPrimitives): InventoryBatch {
        return new InventoryBatch(
            InventoryBatchId.create(p.id),
            InventoryItemId.create(p.inventoryItemId),
            Quantity.of(p.quantityReceived),
            Quantity.of(p.quantityRemaining),
            Money.of(p.unitCostAmount, p.unitCostCurrency),
            p.expirationDate ? InventoryBatchExpirationDate.create(p.expirationDate) : null,
            p.receivedAt,
        );
    };
};