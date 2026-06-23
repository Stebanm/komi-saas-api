import { DomainException } from "@/shared";


/** Unidades de medida soportadas para el inventario. Ampliable según necesidad. */
export enum MeasurementUnit {
    Gram = 'GRAM',
    Milliliter = 'MILLILITER',
    Unit = 'UNIT',
};


export class InvalidInventoryUnitException extends DomainException {
    constructor(value: string) {
        const allowed = Object.values(MeasurementUnit).join(', ');
        super(`Unidad de medida "${value}" no soportada. Permitidas: ${allowed}.`);
    };
};


/** Unidad de medida del item, restringida a un conjunto controlado. */
export class InventoryItemUnit {
    private constructor(public readonly value: MeasurementUnit) { };

    public static create(raw: string): InventoryItemUnit {
        const normalized = raw.trim().toUpperCase();

        if (!Object.values(MeasurementUnit).includes(normalized as MeasurementUnit)) {
            throw new InvalidInventoryUnitException(raw);
        };

        return new InventoryItemUnit(normalized as MeasurementUnit);
    };

    public equals(other: InventoryItemUnit): boolean {
        return this.value === other.value;
    };
};
