import { ChemistryStructure, generateUid } from './chemistry';
import { Component } from './Component';
import { Group } from './Group';

export interface Term extends ChemistryStructure {
    readonly type: 'term',
    readonly components: Array<Component | Group>;
}

class TermImpl implements Term {
    public readonly type: 'term' = 'term';
    public readonly uid = generateUid();

    public constructor(public readonly components: Array<Component | Group> = []) {}

    toString() {
        return this.components.join('');
    }
}

export function newTerm(...parameters: ConstructorParameters<typeof TermImpl>) {
    return new TermImpl(...parameters);
}
