// Credits: https://www.nayuki.io/page/chemical-equation-balancer-javascript

import { Equation, getElementComposition, Term, ElementComposition } from "../chemistry";
import { Matrix } from './Matrix';
import { gcd } from '@/utils';

function buildCompositionMaps(equation: Equation): [ElementComposition, Map<Term, ElementComposition>] {
    const totalElements = getElementComposition(equation);
    const term2elements = new Map<Term, ElementComposition>();

    const populate = (term: Term) => term2elements.set(term, getElementComposition(term));
    equation.leftSide.forEach(populate);
    equation.rightSide.forEach(populate);

    return [totalElements, term2elements];
}

function buildMatrix(equation: Equation): Matrix {
    const {leftSide, rightSide} = equation;
    const [elements, term2elements] = buildCompositionMaps(equation);

    // 最后一行/一列用来存放一个非齐次方程, 避免得到零解
    const matrix = new Matrix(elements.size + 1, leftSide.length + rightSide.length + 1);

    for (const [row, element] of Array.from(elements.keys()).entries()) {
        let column = 0;
        for (const term of leftSide) 
            matrix.set(row, column++, term2elements.get(term)!.get(element) ?? 0);
        for (const term of rightSide) 
            matrix.set(row, column++, -(term2elements.get(term)!.get(element) ?? 0));
    }
    return matrix;
}

export enum SolveError {
    /**
     * 无效解.
     */
    ALL_ZERO = "All-zero solution",

    /**
     * 存在多个不为倍数关系的解.
     */
    MULTIPLE_SULUTIONS = "Multiple independent solutions"
}

function solve(matrix: Matrix): void {
    matrix.gaussJordanEliminate();

    function countNonzeroCoeffs(row: number): number {
		let count = 0;
		for (let i = 0; i < matrix.numCols; i++)
			if (matrix.get(row, i) !== 0)
				count++;
		return count;
	}

    // 寻找第一个包含多个非零系数的行
	let i;
	for (i = 0; i < matrix.numRows - 1; i++) {
		if (countNonzeroCoeffs(i) > 1)
			break;
	}
	if (i === matrix.numRows - 1)
		throw SolveError.ALL_ZERO;

	// 加入非齐次方程
	matrix.set(matrix.numRows - 1, i, 1);
	matrix.set(matrix.numRows - 1, matrix.numCols - 1, 1);

	matrix.gaussJordanEliminate();
}

function extractCoefficients(matrix: Matrix): number[] {
    const {numRows: rows, numCols: cols} = matrix;

    // 判断解的数量
	if (cols - 1 > rows || matrix.get(cols - 2, cols - 2) === 0)
		throw SolveError.MULTIPLE_SULUTIONS;

    // 计算最小公倍数
	let lcm = 1;
	for (let i = 0; i < cols - 1; i++)
		lcm = (lcm / gcd(lcm, matrix.get(i, i))) * matrix.get(i, i);

	const coefs: number[] = [];
	let allZero = true;
	for (let i = 0; i < cols - 1; i++) {
		const coef = (lcm / matrix.get(i, i)) *matrix.get(i, cols - 1);
        coefs.push(coef);

        allZero = allZero && coef === 0;
    }

	if (allZero) throw SolveError.ALL_ZERO;
	return coefs;
}

export function balance(equation: Equation): number[] {
    const matrix = buildMatrix(equation);
    solve(matrix);
    return extractCoefficients(matrix);
}
