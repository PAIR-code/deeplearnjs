import { Conv2DInfo } from '../ops/conv_util';
import { DataId, Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D } from '../tensor';
import * as types from '../types';
import { DataType, TypedArray } from '../types';
import { BackendTimingInfo, KernelBackend } from './backend';
export declare class MathBackendCPU implements KernelBackend {
    private data;
    private canvas;
    constructor();
    register(dataId: DataId, shape: number[], dtype: DataType): void;
    write(dataId: DataId, values: TypedArray): void;
    fromPixels(pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, numChannels: number): Tensor3D;
    read(dataId: DataId): Promise<TypedArray>;
    readSync(dataId: DataId): TypedArray;
    disposeData(dataId: DataId): void;
    time(f: () => void): Promise<BackendTimingInfo>;
    memory(): {
        unreliable: boolean;
    };
    private throwIfNoData(dataId);
    slice<T extends Tensor>(x: T, begin: number[], size: number[]): T;
    stridedSlice<T extends Tensor>(x: T, begin: number[], end: number[], strides: number[], beginMask: number, endMask: number): T;
    reverse<T extends Tensor>(x: T, axis: number[]): T;
    concat(a: Tensor2D, b: Tensor2D): Tensor2D;
    neg<T extends Tensor>(x: T): T;
    add(a: Tensor, b: Tensor): Tensor;
    subtract(a: Tensor, b: Tensor): Tensor;
    pow<T extends Tensor>(a: T, b: Tensor): T;
    matMul(a: Tensor2D, b: Tensor2D, transposeA: boolean, transposeB: boolean): Tensor2D;
    multiply(a: Tensor, b: Tensor): Tensor;
    divide(a: Tensor, b: Tensor): Tensor;
    sum(x: Tensor, axes: number[]): Tensor;
    argMin(x: Tensor, axis: number): Tensor;
    argMax(x: Tensor, axis: number): Tensor;
    cumsum(x: Tensor, axis: number, exclusive: boolean, reverse: boolean): Tensor;
    equal(a: Tensor, b: Tensor): Tensor;
    notEqual(a: Tensor, b: Tensor): Tensor;
    less(a: Tensor, b: Tensor): Tensor;
    lessEqual(a: Tensor, b: Tensor): Tensor;
    greater(a: Tensor, b: Tensor): Tensor;
    greaterEqual(a: Tensor, b: Tensor): Tensor;
    logicalNot<T extends Tensor>(x: T): T;
    logicalAnd(a: Tensor, b: Tensor): Tensor;
    logicalOr(a: Tensor, b: Tensor): Tensor;
    where(condition: Tensor, a: Tensor, b: Tensor, dtype: DataType): Tensor;
    topKValues<T extends Tensor>(x: T, k: number): Tensor1D;
    topKIndices(x: Tensor, k: number): Tensor1D;
    private topK<T>(x, k);
    min(x: Tensor, axes: number[]): Tensor;
    minimum(a: Tensor, b: Tensor): Tensor;
    mod(a: Tensor, b: Tensor): Tensor;
    max(x: Tensor, axes: number[]): Tensor;
    maximum(a: Tensor, b: Tensor): Tensor;
    squaredDifference(a: Tensor, b: Tensor): Tensor;
    ceil<T extends Tensor>(x: T): T;
    floor<T extends Tensor>(x: T): T;
    sign<T extends Tensor>(x: T): T;
    round<T extends Tensor>(x: T): T;
    exp<T extends Tensor>(x: T): T;
    expm1<T extends Tensor>(x: T): T;
    log<T extends Tensor>(x: T): T;
    log1p<T extends Tensor>(x: T): T;
    sqrt<T extends Tensor>(x: T): T;
    rsqrt<T extends Tensor>(x: T): T;
    square<T extends Tensor>(x: T): T;
    reciprocal<T extends Tensor>(x: T): T;
    relu<T extends Tensor>(x: T): T;
    elu<T extends Tensor>(x: T): T;
    eluDer<T extends Tensor>(dy: T, y: T): T;
    selu<T extends Tensor>(x: T): T;
    clip<T extends Tensor>(x: T, min: number, max: number): T;
    abs<T extends Tensor>(x: T): T;
    int<T extends Tensor>(x: T): T;
    sigmoid<T extends Tensor>(x: T): T;
    softplus<T extends Tensor>(x: T): T;
    sin<T extends Tensor>(x: T): T;
    cos<T extends Tensor>(x: T): T;
    tan<T extends Tensor>(x: T): T;
    asin<T extends Tensor>(x: T): T;
    acos<T extends Tensor>(x: T): T;
    atan<T extends Tensor>(x: T): T;
    atan2<T extends Tensor>(a: T, b: T): T;
    sinh<T extends Tensor>(x: T): T;
    cosh<T extends Tensor>(x: T): T;
    tanh<T extends Tensor>(x: T): T;
    asinh<T extends Tensor>(x: T): T;
    acosh<T extends Tensor>(x: T): T;
    atanh<T extends Tensor>(x: T): T;
    erf<T extends Tensor>(x: T): T;
    step<T extends Tensor>(x: T, alpha?: number): T;
    conv2d(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    conv2dDerInput(dy: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    conv2dDerFilter(x: Tensor4D, dy: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    depthwiseConv2D(x: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    depthwiseConv2DDerInput(dy: Tensor4D, filter: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    depthwiseConv2DDerFilter(x: Tensor4D, dy: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    tile<T extends Tensor>(x: T, reps: number[]): T;
    pad<T extends Tensor>(x: T, paddings: Array<[number, number]>, constantValue: number): T;
    transpose<T extends Tensor>(x: T, perm: number[]): T;
    gather<T extends Tensor>(x: T, indices: Tensor1D, axis: number): T;
    private pool(x, convInfo, poolType);
    maxPool(x: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    private maxPoolPositions(x, convInfo);
    maxPoolBackprop(dy: Tensor4D, x: Tensor4D, y: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    avgPoolBackprop(dy: Tensor4D, x: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    cast<T extends Tensor<types.Rank>>(x: T, dtype: DataType): T;
    reshape<T extends Tensor<types.Rank>, R extends types.Rank>(x: T, shape: types.ShapeMap[R]): Tensor<R>;
    avgPool(x: Tensor4D, convInfo: Conv2DInfo): Tensor4D;
    resizeBilinear(x: Tensor4D, newHeight: number, newWidth: number, alignCorners: boolean): Tensor4D;
    resizeBilinearBackprop(dy: Tensor4D, x: Tensor4D, alignCorners: boolean): Tensor<types.Rank.R4>;
    resizeNearestNeighbor(x: Tensor4D, newHeight: number, newWidth: number, alignCorners: boolean): Tensor4D;
    batchNormalization(x: Tensor4D, mean: Tensor4D | Tensor1D, variance: Tensor4D | Tensor1D, varianceEpsilon: number, scale?: Tensor4D | Tensor1D, offset?: Tensor4D | Tensor1D): Tensor4D;
    localResponseNormalization4D(x: Tensor4D, radius: number, bias: number, alpha: number, beta: number): Tensor4D;
    multinomial(logits: Tensor2D, normalized: boolean, numSamples: number, seed: number): Tensor2D;
    oneHot(indices: Tensor1D, depth: number, onValue: number, offValue: number): Tensor2D;
    private broadcastedBinaryOp(a, b, dtype, op);
    dispose(): void;
}
