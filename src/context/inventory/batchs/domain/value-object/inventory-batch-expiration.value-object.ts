import { DomainException } from "@/shared";


export class InvalidExpirationDateException extends DomainException {
    constructor(detail: string) {
        super({
            code: '1300',
            detail: `Fecha de vencimiento inválida: ${detail}.`
        });
    };
};


/**
 * Fecha de vencimiento de un lote. Solo aplica a items perecederos; para
 * no-perecederos el lote guarda null (la nulabilidad se maneja en el aggregate).
 */
export class InventoryBatchExpirationDate {
    private constructor(public readonly value: Date) { };


    public static create(raw: Date | string): InventoryBatchExpirationDate {
        const date = raw instanceof Date ? raw : new Date(raw);

        if (Number.isNaN(date.getTime())) {
            throw new InvalidExpirationDateException(`"${String(raw)}" no es una fecha válida`);
        };

        return new InventoryBatchExpirationDate(date);
    };


    public isBefore(other: Date): boolean {
        return this.value.getTime() < other.getTime();
    };


    public toISOString(): string {
        return this.value.toISOString();
    };


    public equals(other: InventoryBatchExpirationDate): boolean {
        return this.value.getTime() === other.value.getTime();
    };
};