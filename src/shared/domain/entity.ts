import { Uuid } from "../value-object/uuid.value-object";

export abstract class Entity<ID extends Uuid> {


    protected constructor(
        public readonly id: ID
    ) {
        if (id == null)
            throw new Error('El ID de la entidad no puede ser nulo.');
    };


    public getID(): ID {
        return this.id;
    };



};