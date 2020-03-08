export type ElementSymbol = string;

export interface Identifiable {
    uid: string;
}

export interface Stringifiable {
    toString: () => string;
}

export interface Countable {
    count: number;
}

export { default as generateUid } from 'uuid-random';
