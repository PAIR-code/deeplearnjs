import { Scalar, Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D, TensorBuffer } from '../tensor';
import { DataType, Rank, ShapeMap, TensorLike, TensorLike1D, TensorLike2D, TensorLike3D, TensorLike4D, TypedArray } from '../types';
export declare class ArrayOps {
    static tensor<R extends Rank>(values: TensorLike, shape?: ShapeMap[R], dtype?: DataType): Tensor<R>;
    static scalar(value: number | boolean, dtype?: DataType): Scalar;
    static tensor1d(values: TensorLike1D, dtype?: DataType): Tensor1D;
    static tensor2d(values: TensorLike2D, shape?: [number, number], dtype?: DataType): Tensor2D;
    static tensor3d(values: TensorLike3D, shape?: [number, number, number], dtype?: DataType): Tensor3D;
    static tensor4d(values: TensorLike4D, shape?: [number, number, number, number], dtype?: DataType): Tensor4D;
    static ones<R extends Rank>(shape: ShapeMap[R], dtype?: DataType): Tensor<R>;
    static zeros<R extends Rank>(shape: ShapeMap[R], dtype?: DataType): Tensor<R>;
    static fill<R extends Rank>(shape: ShapeMap[R], value: number, dtype?: DataType): Tensor<R>;
    static onesLike<T extends Tensor>(x: T | TensorLike): T;
    static zerosLike<T extends Tensor>(x: T | TensorLike): T;
    static clone<T extends Tensor>(x: T | TensorLike): T;
    static eye(numRows: number, numColumns?: number, batchShape?: [number] | [number, number], dtype?: DataType): Tensor2D;
    static randomNormal<R extends Rank>(shape: ShapeMap[R], mean?: number, stdDev?: number, dtype?: 'float32' | 'int32', seed?: number): Tensor<R>;
    static truncatedNormal<R extends Rank>(shape: ShapeMap[R], mean?: number, stdDev?: number, dtype?: 'float32' | 'int32', seed?: number): Tensor<R>;
    static randomUniform<R extends Rank>(shape: ShapeMap[R], minval?: number, maxval?: number, dtype?: DataType): Tensor<R>;
    static rand<R extends Rank>(shape: ShapeMap[R], randFunction: () => number, dtype?: DataType): Tensor<R>;
    static multinomial(logits: Tensor1D | Tensor2D | TensorLike, numSamples: number, seed?: number, normalized?: boolean): Tensor1D | Tensor2D;
    static oneHot(indices: Tensor1D, depth: number, onValue?: number, offValue?: number): Tensor2D;
    static fromPixels(pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, numChannels?: number): Tensor3D;
    static toPixels(img: Tensor2D | Tensor3D, canvas?: HTMLCanvasElement): Promise<Uint8ClampedArray>;
    static reshape<R2 extends Rank>(x: Tensor | TensorLike, shape: ShapeMap[R2]): Tensor<R2>;
    static squeeze<T extends Tensor>(x: Tensor | TensorLike, axis?: number[]): T;
    static cast<T extends Tensor>(x: T | TensorLike, dtype: DataType): T;
    static tile<T extends Tensor>(x: T | TensorLike, reps: number[]): T;
    static gather<T extends Tensor>(x: T | TensorLike, indices: Tensor1D | TensorLike, axis?: number): T;
    static pad1d(x: Tensor1D, paddings: [number, number], constantValue?: number): Tensor1D;
    static pad2d(x: Tensor2D, paddings: [[number, number], [number, number]], constantValue?: number): Tensor2D;
    static pad3d(x: Tensor3D, paddings: [[number, number], [number, number], [number, number]], constantValue?: number): Tensor3D;
    static pad4d(x: Tensor4D, paddings: [[number, number], [number, number], [number, number], [number, number]], constantValue?: number): Tensor4D;
    static pad<T extends Tensor>(x: T | TensorLike, paddings: Array<[number, number]>, constantValue?: number): T;
    static stack<T extends Tensor>(tensors: T[] | TensorLike[], axis?: number): Tensor;
    static unstack<T extends Tensor>(x: T | TensorLike, axis?: number): Tensor[];
    static split<T extends Tensor>(x: T | TensorLike, numOrSizeSplits: number[] | number, axis?: number): T[];
    static cumsum<T extends Tensor>(x: Tensor | TensorLike, axis?: number, exclusive?: boolean, reverse?: boolean): T;
    static expandDims<R2 extends Rank>(x: Tensor | TensorLike, axis?: number): Tensor<R2>;
    static linspace(start: number, stop: number, num: number): Tensor1D;
    static range(start: number, stop: number, step?: number, dtype?: 'float32' | 'int32'): Tensor1D;
    static buffer<R extends Rank>(shape: ShapeMap[R], dtype?: DataType, values?: TypedArray): TensorBuffer<R>;
    static print<T extends Tensor>(x: T, verbose?: boolean): void;
}
