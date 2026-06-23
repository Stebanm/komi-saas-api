import Decimal from 'decimal.js';


export class InvalidMoneyError extends Error {
    constructor(message: string) {
        super(message);
    };
};


export class CurrencyMismatchError extends Error {
    constructor(a: string, b: string) {
        super(`No se puede operar Money con monedas distintas: ${a} vs ${b}`);
    };
};



export class Money {
    private readonly amount: Decimal;
    public readonly currency: string;


    private constructor(amount: Decimal, currency: string) {
        this.amount = amount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
        this.currency = currency;
    };


    public static of(amount: string, currency = 'COP'): Money {
        const code = (currency ?? '').trim().toUpperCase();

        if (!/^[A-Z]{3}$/.test(code)) {
            throw new InvalidMoneyError(`Moneda inválida: "${currency}" (use ISO de 3 letras).`);
        };

        let decimal: Decimal;

        try {
            decimal = new Decimal(amount);

        } catch {
            throw new InvalidMoneyError(`Monto inválido: "${amount}".`);
        };

        if (!decimal.isFinite()) {
            throw new InvalidMoneyError(`Monto inválido: "${amount}".`);
        };

        if (decimal.isNegative()) {
            throw new InvalidMoneyError(`El monto no puede ser negativo: "${amount}".`);
        };

        return new Money(decimal, code);
    };


    public static zero(currency = 'COP') {
        return Money.of('0', currency);
    };


    // ---- Aritmética (devuelve nuevas instancias: inmutables) ----

    public add(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.amount.plus(other.amount), this.currency);
    };


    public subtract(other: Money): Money {
        this.assertSameCurrency(other);
        const result = this.amount.minus(other.amount);
        if (result.isNegative()) {
            throw new InvalidMoneyError('La resta resultaría en un monto negativo.');
        }
        return new Money(result, this.currency);
    };


    public multiply(factor: number): Money {
        if (factor < 0) {
            throw new InvalidMoneyError('El multiplicador no puede ser negativo.');
        };

        return new Money(this.amount.times(factor), this.currency);
    };


    // ---- Comparación ----

    public equals(other: Money): boolean {
        return (
            other instanceof Money &&
            this.amount.equals(other.amount) &&
            this.currency === other.currency
        );
    };


    // ---- Salida ----

    public getAmount(): string {
        return this.amount.toFixed(2); // "10450.00", string exacto
    };


    public toString(): string {
        return `${this.currency}. ${this.getAmount()}`;
    };


    public toPrimitives(): { amount: string; currency: string } {
        return { amount: this.getAmount(), currency: this.currency };
    };


    private assertSameCurrency(other: Money): void {
        if (this.currency !== other.currency) {
            throw new CurrencyMismatchError(this.currency, other.currency);
        };
    };
};