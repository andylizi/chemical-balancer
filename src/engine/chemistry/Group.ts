import { ChemistryStructure, Countable, generateUid } from './chemistry';
import { Component } from './Component';

export interface Group extends ChemistryStructure, Countable {
    readonly type: 'group',
    readonly components: Array<Component | Group>;
}

class GroupImpl implements Group {
    public readonly type: 'group' = 'group';
    public readonly uid = generateUid();
    private _count: number = 1;

    public constructor(public readonly components: Array<Component | Group> = [], count: number = 1) {
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
        if (this.count > 1) {
            return `(${this.components.join('')})${this.count}`;
        } else {
            return `(${this.components.join('')})`;
        }
    }
}

export function newGroup(...parameters: ConstructorParameters<typeof GroupImpl>) {
    return new GroupImpl(...parameters);
}
