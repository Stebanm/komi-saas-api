import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InventoryItemRepository } from "../items/domain";
import { InventoryItemModule } from "../items/inventory-items.module";

import { InventoryBatchRepository } from "./domain";
import { CreateInventoryBatchUseCase, SearchInventoryBatchUseCase } from "./application";
import { InventoryBatchController, InventoryBatchEntity, InventoryBatchService } from "./infrastructure";


@Module({
    imports: [
        TypeOrmModule.forFeature([InventoryBatchEntity]),
        InventoryItemModule
    ],
    controllers: [InventoryBatchController],
    providers: [
        {
            provide: InventoryBatchRepository,
            useClass: InventoryBatchService
        },
        {
            provide: CreateInventoryBatchUseCase,
            useFactory: (
                repositoryBatch: InventoryBatchRepository,
                repositoryItem: InventoryItemRepository
            ) => new CreateInventoryBatchUseCase(repositoryBatch, repositoryItem),
            inject: [InventoryBatchRepository, InventoryItemRepository]
        },
        {
            provide: SearchInventoryBatchUseCase,
            useFactory: (repository: InventoryBatchRepository) => new SearchInventoryBatchUseCase(repository),
            inject: [InventoryBatchRepository]
        }
    ]
})

export class InventoryBatchModule { };