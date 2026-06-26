import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InventoryItemRepository } from "./domain";
import { CreateInventoryItemUseCase, SearchInventoryItemUseCase } from "./application";
import { InventoryItemController, InventoryItemEntity, InventoryItemService } from "./infrastructure";

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
        },
        {
            provide: SearchInventoryItemUseCase,
            useFactory: (repository: InventoryItemRepository) => new SearchInventoryItemUseCase(repository),
            inject: [InventoryItemRepository]
        }
    ]
})

export class InventoryItemModule { };