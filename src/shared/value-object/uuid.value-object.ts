import { v7 as uuid } from 'uuid';


export const generateUUID = (): string => uuid();


export abstract class Uuid {
    protected constructor(
        public readonly value: string
    ) { };


    public equals(value: Uuid): boolean {
        return this.value === value.value;
    };


    public toString(): string {
        return this.value;
    };
};