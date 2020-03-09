export function isNull(x: any | null): x is null {
    return x === null;
};

export { isFalsy } from 'utility-types';

/**
 * 求最大公因数 (辗转相除法).
 */
export function gcd(a: number, b: number): number {
    a = Math.abs(a), b = Math.abs(b);

    let t;
    while (b !== 0) {
        t = a % b;
        a = b;
        b = t;
    }
    return a;
}

export class Stack<T> {
    private _array: Array<T> = [];

    get length(): number {
        return this._array.length;
    }

    push(...items: T[]): number {
        return this._array.push.apply(this._array, items);
    }

    pop(): T | null {
        const v = this._array.pop();
        return v === undefined ? null : v;
    }

    toString(): string {
        return this._array.toString();
    }

    get last(): T {
        return this._array[this.length - 1];
    }

    lastOrNull(): T | null {
        if (this.length === 0) return null;
        return this.last;
    }

    lastOrReturn(whenEmpty: (this: Stack<T>) => any): T {
        if (this.length === 0) return <T>whenEmpty.call(this);
        return this.last;
    }

    lastOrPush(whenEmpty: (this: Stack<T>) => T): T {
        if (this.length === 0) {
            const last = whenEmpty.call(this);
            this._array.push(last);
            return last;
        }
        return this.last;
    }
}