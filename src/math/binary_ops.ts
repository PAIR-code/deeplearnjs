/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {ENV} from '../environment';
import * as util from '../util';

import * as broadcast_util from './broadcast_util';
import {doc, operation} from './decorators';
import {NDArray, Scalar} from './ndarray';

export class Ops {
  /**
   * Adds two NDArrays element-wise, A + B. Supports broadcasting.
   * For a stricter version without broadcasting use addStrict().
   *
   * @param a The first `NDArray` to add.
   * @param b The second `NDArray` to add. Must have the same type as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static add<T extends NDArray>(a: NDArray, b: NDArray): T {
    util.assertTypesMatch(a, b);
    const outShape =
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);

    const der = (dy: NDArray, y: NDArray) => {
      const derA = () => {
        let res = dy;
        const reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
        if (reduceAxes.length > 0) {
          res = res.sum(reduceAxes);
        }
        return res.reshape(a.shape);
      };
      const derB = () => {
        let res = dy;
        const reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
        if (reduceAxes.length > 0) {
          res = res.sum(reduceAxes);
        }
        return res.reshape(b.shape);
      };
      return {a: derA, b: derB};
    };
    return ENV.engine.executeKernel('Add', {inputs: {a, b}}, der) as T;
  }

  /**
   * Adds two NDArrays element-wise, A + B. Inputs must
   * be the same shape. For broadcasting support, use add() instead.
   *
   * @param a The first NDArray to multiply element-wise.
   * @param b The second NDArray to multiply element-wise.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static addStrict<T extends NDArray>(a: T, b: T): T {
    util.assertShapesMatch(a.shape, b.shape, 'Error in addStrict: ');
    return a.add(b);
  }

  /**
   * Subtracts two NDArrays element-wise, A - B. Supports broadcasting.
   * For a stricter version without broadcasting use subStrict().
   *
   * @param a The first `NDArray`.
   * @param b The second `NDArray`. Must have the same dtype as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static sub<T extends NDArray>(a: NDArray, b: NDArray): T {
    util.assertTypesMatch(a, b);
    const outShape =
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);

    const der = (dy: NDArray, y: NDArray) => {
      const derA = () => {
        let res = dy;
        const reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
        if (reduceAxes.length > 0) {
          res = res.sum(reduceAxes);
        }
        return res.reshape(a.shape);
      };
      const derB = () => {
        let res = dy;
        const reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
        if (reduceAxes.length > 0) {
          res = res.sum(reduceAxes);
        }
        return res.neg().reshape(b.shape);
      };
      return {a: derA, b: derB};
    };
    return ENV.engine.executeKernel('Sub', {inputs: {a, b}}, der) as T;
  }

  /**
   * Subtracts two NDArrays element-wise, A - B. Inputs must
   * be the same shape. For broadcasting support, use sub() instead.
   *
   * @param a The first NDArray to multiply element-wise.
   * @param b The second NDArray to multiply element-wise.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static subStrict<T extends NDArray>(a: T, b: T): T {
    util.assertShapesMatch(a.shape, b.shape, 'Error in subStrict: ');
    return a.sub(b);
  }

  /**
   * Computes the power of one value to another. Supports broadcasting.
   * Given a tensor x and a tensor y, this operation computes x^y for
   * corresponding elements in x and y. For example:
   * x = tf.constant([[2, 2], [3, 3]])
   * y = tf.constant([[8, 16], [2, 3]])
   * pow(x, y)  # [[256, 65536], [9, 27]]
   *
   * @param base The base NDArray to pow element-wise.
   * @param exp The exponent NDArray to pow element-wise.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static pow<T extends NDArray>(base: NDArray, exp: NDArray): T {
    util.assert(
        exp.dtype === 'int32',
        'only supports int32 data type for the exponent parameter.');
    broadcast_util.assertAndGetBroadcastShape(base.shape, exp.shape);

    const gradient = (dy: NDArray, y: NDArray) => {
      if (!util.arraysEqual(base.shape, exp.shape)) {
        throw new Error(
            `Gradient of pow not yet supported for broadcasted shapes.`);
      }
      const derBase = () => {
        const dx = exp.toFloat().mul(
            base.pow(exp.sub(Scalar.new(1, 'int32'))).toFloat());
        return dy.mul(dx);
      };
      const derExp = () => {
        throw new Error(
            `Backprop through exponent of math.pow not ` +
            `implemented yet.`);
      };
      return {base: derBase, exp: derExp};
    };

    return ENV.engine.executeKernel('Pow', {inputs: {base, exp}}, gradient) as
        T;
  }

  /**
   * Computes the power of one value to another. Inputs must
   * be the same shape. For broadcasting support, use pow() instead.
   *
   * @param base The base NDArray to pow element-wise.
   * @param exp The exponent NDArray to pow element-wise.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static powStrict<T extends NDArray>(base: T, exp: NDArray): T {
    util.assertShapesMatch(base.shape, exp.shape, 'Error in powStrict: ');
    return base.pow(exp);
  }

  /**
   * Multiplies two NDArrays element-wise, A * B. Supports broadcasting.
   * For a stricter version without broadcasting use mulStrict().
   *
   * @param a The first `NDArray`.
   * @param b The second `NDArray`. Must have the same dtype as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static mul<T extends NDArray>(a: NDArray, b: NDArray): T {
    util.assertTypesMatch(a, b);
    const outShape =
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);

    const der = (dy: NDArray, y: NDArray) => {
      const derA = () => {
        const res = dy.mul(b.toFloat());
        const reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
        if (reduceAxes.length > 0) {
          return res.sum(reduceAxes).reshape(a.shape);
        }
        return res;
      };
      const derB = () => {
        const res = dy.mul(a.toFloat());
        const reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
        if (reduceAxes.length > 0) {
          return res.sum(reduceAxes).reshape(b.shape);
        }
        return res;
      };
      return {a: derA, b: derB};
    };
    return ENV.engine.executeKernel('Mul', {inputs: {a, b}}, der) as T;
  }

  /**
   * @deprecated Use mulStrict() instead.
   */
  @operation
  static elementWiseMul<T extends NDArray>(a: T, b: T): T {
    return a.mulStrict(b);
  }

  /**
   * Multiplies two NDArrays element-wise, A * B. Inputs must
   * be the same shape. For broadcasting support, use mul().
   *
   * @param a The first `NDArray`.
   * @param b The second `NDArray`. Must have the same dtype as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static mulStrict<T extends NDArray>(a: T, b: T): T {
    util.assertShapesMatch(a.shape, b.shape, 'Error in multiplyStrict: ');
    return a.mul(b) as T;
  }

  /**
   * Divides two NDArrays element-wise, A / B. Supports broadcasting.
   * For a stricter version without broadcasting use divStrict().
   *
   * @param a The first `NDArray`.
   * @param b The second `NDArray`. Must have the same dtype as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static div<T extends NDArray>(a: NDArray, b: NDArray): T {
    const outShape =
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
    const der = (dy: NDArray, y: NDArray) => {
      const derA = () => {
        const res = dy.div(b.toFloat());
        const reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
        if (reduceAxes.length > 0) {
          return res.sum(reduceAxes).reshape(a.shape);
        }
        return res;
      };
      const derB = () => {
        let res = dy.mul(a.toFloat());
        const reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
        if (reduceAxes.length > 0) {
          res = res.sum(reduceAxes).reshape(b.shape);
        }
        const tmp = b.square() as NDArray;
        return res.div(tmp.toFloat()).neg() as NDArray;
      };
      return {a: derA, b: derB};
    };
    return ENV.engine.executeKernel('Div', {inputs: {a, b}}, der) as T;
  }

  /**
   * Divides two NDArrays element-wise, A / B. Inputs must
   * be the same shape. For broadcasting support, use div() instead.
   *
   * @param a The first NDArray to multiply element-wise.
   * @param b The second NDArray to multiply element-wise.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static divStrict<T extends NDArray>(a: T, b: T): T {
    util.assertShapesMatch(a.shape, b.shape, 'Error in divideStrict: ');
    return a.div(b) as T;
  }

  /** @deprecated Use div() instead. */
  @operation
  static scalarDividedByArray<T extends NDArray>(c: Scalar, a: T): T {
    util.assert(
        c.size === 1,
        `Error in scalarDividedByArray: first argument must be rank 0, but ` +
            `got NDArray of rank ${c.rank}.`);
    return c.div(a) as T;
  }

  /** @deprecated Use div(A, c) instead. */
  @operation
  static arrayDividedByScalar<T extends NDArray>(a: T, c: Scalar): T {
    util.assert(
        c.size === 1,
        `Error in arrayDividedByScalar: second argument must be rank 0, ` +
            `but got NDArray of rank ${c.rank}.`);
    return a.div(c) as T;
  }

  /**
   * Returns the min of a and b (`a < b ? a : b`) element-wise.
   * Supports broadcasting.
   *
   * @param a The first ndarray.
   * @param b The second ndarray. Must have the same type as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static minimum<T extends NDArray>(a: NDArray, b: NDArray): T {
    util.assertTypesMatch(a, b);
    broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
    return ENV.engine.executeKernel('Minimum', {inputs: {a, b}}) as T;
  }

  /**
   * Returns the min of a and b (`a < b ? a : b`) element-wise. Inputs must
   * be the same shape. For broadcasting support, use minimum().
   *
   * @param a The first `NDArray`.
   * @param b The second `NDArray`. Must have the same dtype as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static minimumStrict<T extends NDArray>(a: T, b: T): T {
    util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
    return a.minimum(b);
  }

  /**
   * Returns the max of a and b (`a > b ? a : b`) element-wise.
   * Supports broadcasting.
   *
   * @param a The first ndarray.
   * @param b The second ndarray. Must have the same type as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static maximum<T extends NDArray>(a: NDArray, b: NDArray): T {
    util.assertTypesMatch(a, b);
    broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
    return ENV.engine.executeKernel('Maximum', {inputs: {a, b}}) as T;
  }

  /**
   * Returns the max of a and b (`a > b ? a : b`) element-wise. Inputs must
   * be the same shape. For broadcasting support, use maximum().
   *
   * @param a The first `NDArray`.
   * @param b The second `NDArray`. Must have the same dtype as `a`.
   */
  @doc({heading: 'Operations', subheading: 'Arithmetic'})
  @operation
  static maximumStrict<T extends NDArray>(a: T, b: T): T {
    util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
    return a.maximum(b);
  }
}
