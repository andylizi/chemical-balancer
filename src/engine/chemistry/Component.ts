import { ElementSymbol, Identifiable, Stringifiable, Countable, generateUid } from './chemistry';

export interface Component extends Identifiable, Stringifiable, Countable {
    readonly type: 'component',
    symbol: ElementSymbol
}

class ComponentImpl implements Component {
    public readonly type: 'component' = 'component';
    public readonly uid = generateUid();
    private _count: number = 1;
    
    public constructor(public symbol: ElementSymbol, count: number = 1) {
        this.count = count;
    }

    get count(): number {
        return this._count;
    }

    set count(n: number) {
        if (n < 1) throw new RangeError('count');
        this._count = n;
    }

    toString() {
        return this.symbol + this.count;
    }
}

export function newComponent(...parameters: ConstructorParameters<typeof ComponentImpl>) {
    return new ComponentImpl(...parameters);
}