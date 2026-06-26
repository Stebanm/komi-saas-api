import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { InventoryItemEntity } from "@/context/inventory/items/infrastructure";


@Entity({ name: 'inventory_batchs' })
export class InventoryBatchEntity {

    @PrimaryColumn({ name: 'inventory_batch_id', type: 'uuid' })
    id!: string;


    // Columna escalar: es lo que el dominio referencia y lo que el mapper lee/escribe.
    @Column({ name: 'inventory_item_id', type: 'uuid' })
    inventoryItemId!: string;


    // Relación SOLO de infraestructura: crea la FK hacia inventory_items.
    // No se navega desde el dominio; existe para integridad referencial.
    // onDelete RESTRICT: no se puede borrar un item que todavía tiene lotes.
    @ManyToOne(() => InventoryItemEntity, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'inventory_item_id' })
    item?: InventoryItemEntity;


    /* @Column({ name: 'branch_id', type: 'uuid' })
    branchId!: string; */
    // LISTO: descomentar (y migrar) cuando exista el contexto de branches.


    @Column({ name: 'inventory_batch_quantity_received', type: 'numeric', precision: 14, scale: 3 })
    quantityReceived!: string;


    @Column({ name: 'inventory_batch_quantity_remaining', type: 'numeric', precision: 14, scale: 3 })
    quantityRemaining!: string;


    @Column({ name: 'inventory_batch_unit_cost_amount', type: 'numeric', precision: 12, scale: 2 })
    unitCostAmount!: string;


    @Column({ name: 'inventory_batch_unit_cost_currency', type: 'varchar', length: 3 })
    unitCostCurrency!: string;


    @Column({ name: 'inventory_batch_expiration_date', type: 'timestamptz', nullable: true })
    expirationDate!: Date | null;


    @Column({ name: 'inventory_batch_received_at', type: 'timestamptz' })
    receivedAt!: Date;


    @CreateDateColumn({ name: 'inventory_batch_created_at', type: 'timestamptz' })
    createdAt!: Date;


    @UpdateDateColumn({ name: 'inventory_batch_updated_at', type: 'timestamptz' })
    updatedAt!: Date;
};