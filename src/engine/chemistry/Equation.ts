import { ChemistryStructure, Stringifiable, generateUid } from './chemistry';
import { Term } from './Term';

export interface Equation extends ChemistryStructure {
    readonly type: 'equation',
    readonly leftSide: Array<Term>;
    readonly rightSide: Array<Term>;
}

class EquationImpl implements Equation {
    public readonly type: 'equation' = 'equation';
    public readonly uid = generateUid();

    public constructor(public readonly leftSide: Array<Term> = [], public readonly rightSide: Array<Term> = []) {}

    toString() {
        return this.leftSide.join(' + ') + ' -> ' + this.rightSide.join(' + ');
    }
}

export function newEquation(...parameters: ConstructorParameters<typeof EquationImpl>) {
    return new EquationImpl(...parameters);
}
