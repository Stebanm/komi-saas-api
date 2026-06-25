import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'inventory_items' })
export class InventoryItemEntity {

    @PrimaryColumn({ name: 'inventory_item_id', type: 'uuid' })
    id!: string;


    /* @Column({ name: 'tenant_id', type: 'uuid' })
    tenantId!: string; */


    @Column({ name: 'inventory_item_sku_number', type: 'bigint', unique: true })
    @Generated('increment')
    skuNumber!: string;


    @Column({ name: 'inventory_item_name', type: 'varchar', length: 120 })
    name!: string;


    @Column({ name: 'inventory_item_unit_of_measure', type: 'varchar', length: 20 })
    unitOfMeasure!: string;


    // Postgres 'numeric' se materializa como string en JS; el mapper lo convierte.
    @Column({ name: 'inventory_item_cost_amount', type: 'numeric', precision: 12, scale: 2 })
    costAmount!: string;


    @Column({ name: 'inventory_item_cost_currency', type: 'varchar', length: 3 })
    costCurrency!: string;


    @Column({ name: 'inventory_item_is_perishable', type: 'boolean', default: false })
    isPerishable!: boolean;


    @Column({ name: 'inventory_item_is_active', type: 'boolean', default: true })
    isActive!: boolean;


    @CreateDateColumn({ name: 'inventory_item_created_at', type: 'timestamptz' })
    createdAt!: Date;


    @UpdateDateColumn({ name: 'inventory_item_updated_at', type: 'timestamptz' })
    updatedAt!: Date;
};