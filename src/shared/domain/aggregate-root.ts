import { Uuid } from "../value-object/uuid.value-object";
import { DomainEvent } from "./domain-event";
import { Entity } from "./entity";


/**
 * Clase base para todos los Aggregate Roots.
 *
 * Un Aggregate Root es la entidad que sirve como único punto de entrada al
 * agregado: mantiene sus invariantes y registra eventos de dominio para que la
 * infraestructura los publique después de persistir.
 *
 * @typeParam TId - tipo del identificador, atado a Uuid.
 */
export abstract class AggregateRoot<ID extends Uuid> extends Entity<ID> {
    private readonly domainEvents: DomainEvent[] = [];

    protected registerEvent(event: DomainEvent): void {
        if (event != null) {
            this.domainEvents.push(event);
        };
    };


    public getDomainEvents(): ReadonlyArray<DomainEvent> {
        return [...this.domainEvents];
    };


    public clearDomainEvents(): void {
        this.domainEvents.length = 0;
    };
};