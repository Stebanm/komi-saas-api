import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryItemEntity } from "./infrastructure/persistence/inventory-item.entity";
import { InventoryItemController } from "./infrastructure/http/inventory-item.controller";
import { InventoryItemRepository } from "./domain/inventory-item.repository";
import { InventoryItemService } from "./infrastructure/persistence/inventory-item.services";
import { CreateInventoryItemUseCase } from "./application/create-item/create-inventory-item.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([InventoryItemEntity])],
    controllers: [InventoryItemController],
    providers: [
        {
            provide: InventoryItemRepository,
            useClass: InventoryItemService
        },
        {
            provide: CreateInventoryItemUseCase,
            useFactory: (repository: InventoryItemRepository) => new CreateInventoryItemUseCase(repository),
            inject: [InventoryItemRepository]
        }
    ]
})

export class InventoryItemModule { };