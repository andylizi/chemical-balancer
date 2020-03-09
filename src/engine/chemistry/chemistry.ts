import { Component, Group, Term, Equation } from '.';

export type ElementSymbol = string;
export type ElementComposition = Map<ElementSymbol, number>;

export interface ChemistryStructure extends UniqueIdentifiable, Stringifiable {
    readonly type: string;
}

export type ChemistryStructures = Component | Group | Term | Equation;

export interface UniqueIdentifiable {
    readonly uid: string;
}

export interface Stringifiable {
    toString: () => string;
}

export interface Countable {
    count: number;
}

export { default as generateUid } from 'uuid-random';

function extractElementTypes(structure: ChemistryStructures, map: ElementComposition): void {
    function add(component: { symbol: ElementSymbol, count: number }): void {
        const {symbol, count} = component;
        map.set(symbol, (map.get(symbol) ?? 0) + count);
    }

    const extract = (item: ChemistryStructures) => extractElementTypes(item, map);
    switch (structure.type) {
        case 'component': 
            add(structure);
            break;
        case 'group': 
            for (let i = 0; i < structure.count; i++)
                structure.components.forEach(extract);
            break;
        case 'term':
            structure.components.forEach(extract);
            break;
        case 'equation':
            structure.leftSide.forEach(extract);
            structure.rightSide.forEach(extract);
            break;
        default:
            return ((x: never) => { throw new Error(); })(structure);
    }
}

export function getElementComposition(structures: ChemistryStructures): ElementComposition;
export function getElementComposition(structures: ChemistryStructures[]): ElementComposition;
export function getElementComposition(structure: ChemistryStructures | ChemistryStructures[]): ElementComposition {
    const map: ElementComposition = new Map();
    if (Array.isArray(structure)) {
        structure.forEach(struct => extractElementTypes(struct, map));
    } else {
        extractElementTypes(structure, map);
    }
    return map;
}
