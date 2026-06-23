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
export abstract class AggregateRoot<TId extends Uuid> extends Entity<TId> {
    private readonly domainEvent: DomainEvent[] = [];

    protected registerEvent(event: DomainEvent): void {
        if (event != null) {
            this.domainEvent.push(event);
        };
    };
};