// Credits: https://www.nayuki.io/page/chemical-equation-balancer-javascript

import { gcd } from '@/utils';

/**
 * 行向量加法.
 * 
 * @returns 一个新的行向量
 */
export function addRows(a: number[], b: number[]): number[] {
    const result: number[] = [];
    for (let i = 0; i < a.length; i++)
        result.push(a[i] + b[i]);
    return result;
}

/**
 * 行向量数乘.
 * 
 * @param row 行向量
 * @param scalar 乘数
 * @returns 一个新的行向量
 */
export function multiplyRow(row: number[], scalar: number): number[] {
    return row.map(val => val * scalar);
}

/**
 * 计算给定行向量内所有元素的最大公约数 (GCD).
 * 
 * @param row 行向量
 * @returns 最大公约数
 */
export function gcdRow(row: number[]): number {
    let result = 0;
    for (const val of row)
        result = gcd(val, result);
    return result;
}

/**
 * 化简行向量, 使得首个非零元素为正, 且所有元素的最大公约数为 0 或 1.
 * 
 * 例如: simplifyRow([0, -2, 2, 4]) = [0, 1, -1, -2].
 * @param row 行向量
 * @returns 化简后的新行向量
 */
export function simplifyRow(row: number[]): number[] {
    let sign = 0;
    for (const val of row) {
        if (val !== 0) {
            sign = Math.sign(val);
            break;
        }
    }
    if (sign === 0)
        return row.slice();
    const g: number = gcdRow(row) * sign;
    return row.map(val => val / g);
}

export class Matrix {
    private cells: number[][];

    /**
     * @param numRows 行数
     * @param numCols 列数
     */
	public constructor(public readonly numRows: number, public readonly numCols: number) {
		if (numRows < 0 || numCols < 0)
			throw new RangeError();
		
		// Initialize with zeros
		const row: number[] = [];
		for (let j = 0; j < numCols; j++)
			row.push(0);
		this.cells = [];  // Main data (the matrix)
		for (let i = 0; i < numRows; i++)
			this.cells.push(row.slice());
	}

    /**
     * @param r 行
     * @param c 列
     */
	public get(r: number, c: number): number {
		if (r < 0 || r >= this.numRows || c < 0 || c >= this.numCols)
			throw new RangeError();
		return this.cells[r][c];
	}

	/**
     * @param r 行
     * @param c 列
     * @param val 值
     */
	public set(r: number, c: number, val: number): void {
		if (r < 0 || r >= this.numRows || c < 0 || c >= this.numCols)
            throw new RangeError();
		this.cells[r][c] = val;
    }

    /**
     * 拷贝矩阵.
     * 
     * @returns 与此矩阵内部元素一样的新矩阵
     */
    public clone(): Matrix {
        const clone = new Matrix(this.numRows, this.numCols);
        clone.cells = this.cells.map(row => row.slice());
        return clone;
    }

    public toString(): string {
        return '[' + this.cells.map(row => '[' + row.join(', ') + ']').join(', ') + ']';
    }

    /**
     * 将矩阵中的两行交换位置. 
     * 
     * @param i 第一行的索引
     * @param j 第二行的索引
     * @throws RangeError
     */
	private swapRows(i: number, j: number): void {
		if (i < 0 || i >= this.numRows || j < 0 || j >= this.numRows)
            throw new RangeError();
		const temp: number[] = this.cells[i];
		this.cells[i] = this.cells[j];
		this.cells[j] = temp;
	}

    /**
     * 使用高斯消元法, 将此矩阵化为一种行最简形矩阵 (RREF), 但其非零行的第一个元素不必是 1.
     * 每一行都会被化为最简形式.
     */
	public gaussJordanEliminate(): void {
		// 化简所有行
		let cells: number[][] = this.cells = this.cells.map(simplifyRow);

		// 求行阶梯形矩阵 (REF)
		let numPivots = 0;
		for (let i = 0; i < this.numCols; i++) {
			// 寻找主元
			let pivotRow = numPivots;
			while (pivotRow < this.numRows && cells[pivotRow][i] === 0)
				pivotRow++;
			if (pivotRow === this.numRows)
				continue;
			const pivot = cells[pivotRow][i];
			this.swapRows(numPivots, pivotRow);
			numPivots++;
			
			// 向下消除
			for (let j = numPivots; j < this.numRows; j++) {
				const g = gcd(pivot, cells[j][i]);
				cells[j] = simplifyRow(addRows(multiplyRow(cells[j], pivot / g), multiplyRow(cells[i], -cells[j][i] / g)));
			}
		}

		// 求行最简形矩阵 (RREF)
		for (let i = this.numRows - 1; i >= 0; i--) {
			// 寻找主元
			let pivotCol = 0;
			while (pivotCol < this.numCols && cells[i][pivotCol] === 0)
				pivotCol++;
			if (pivotCol === this.numCols)
				continue;
			const pivot = cells[i][pivotCol];
			
			// 向上
			for (let j = i - 1; j >= 0; j--) {
				const g = gcd(pivot, cells[j][pivotCol]);
				cells[j] = simplifyRow(addRows(multiplyRow(cells[j], pivot / g), multiplyRow(cells[i], -cells[j][pivotCol] / g)));
			}
		}
	}
}