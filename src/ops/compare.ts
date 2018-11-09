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
import {Tensor} from '../tensor';
import {assertTypesMatch} from '../tensor_util';
import {convertToTensor} from '../tensor_util_env';
import {TensorLike} from '../types';
import {assertShapesMatch} from '../util';
import {assertAndGetBroadcastShape} from './broadcast_util';
import {op} from './operation';
import {zerosLike} from './tensor_ops';

/**
 * Returns the truth value of (a != b) element-wise. Supports broadcasting.
 *
 * We also expose `tf.notEqualStrict` which has the same signature as this op
 * and asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([0, 2, 3]);
 *
 * a.notEqual(b).print();
 * ```
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 */
/** @doc {heading: 'Operations', subheading: 'Logical'} */
function notEqual_<T extends Tensor>(
    a: Tensor|TensorLike, b: Tensor|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'notEqual');
  const $b = convertToTensor(b, 'b', 'notEqual');
  assertTypesMatch($a, $b);
  assertAndGetBroadcastShape($a.shape, $b.shape);
  return ENV.engine.runKernel(backend => backend.notEqual($a, $b), {$a, $b}) as
      T;
}

/**
 * Strict version of `tf.notEqual` that forces `a` and `b` to be of the same
 * shape.
 *
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same shape and dtype as
 *     `a`.
 */
function notEqualStrict_<T extends Tensor>(
    a: T|TensorLike, b: T|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'notEqualStrict');
  const $b = convertToTensor(b, 'b', 'notEqualStrict');
  assertShapesMatch($a.shape, $b.shape, 'Error in notEqualStrict: ');
  return $a.notEqual($b);
}

/**
 * Returns the truth value of (a < b) element-wise. Supports broadcasting.
 *
 * We also expose `tf.lessStrict` which has the same signature as this op and
 * asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([2, 2, 2]);
 *
 * a.less(b).print();
 * ```
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 */
/** @doc {heading: 'Operations', subheading: 'Logical'} */
function less_<T extends Tensor>(
    a: Tensor|TensorLike, b: Tensor|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'less');
  const $b = convertToTensor(b, 'b', 'less');
  assertTypesMatch($a, $b);
  assertAndGetBroadcastShape($a.shape, $b.shape);

  return ENV.engine.runKernel(backend => backend.less($a, $b), {$a, $b}) as T;
}

/**
 * Strict version of `tf.less` that forces `a` and `b` to be of the same
 * shape.
 *
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same shape and dtype as
 *     `a`.
 */
function lessStrict_<T extends Tensor>(a: T|TensorLike, b: T|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'lessStrict');
  const $b = convertToTensor(b, 'b', 'lessStrict');
  assertShapesMatch($a.shape, $b.shape, 'Error in lessStrict: ');
  return $a.less($b);
}

/**
 * Returns the truth value of (a == b) element-wise. Supports broadcasting.
 *
 * We also expose `tf.equalStrict` which has the same signature as this op
 * and asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([2, 2, 2]);
 *
 * a.equal(b).print();
 * ```
 *
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 */
/** @doc {heading: 'Operations', subheading: 'Logical'} */
function equal_<T extends Tensor>(
    a: Tensor|TensorLike, b: Tensor|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'equal');
  const $b = convertToTensor(b, 'b', 'equal');
  assertTypesMatch($a, $b);
  assertAndGetBroadcastShape($a.shape, $b.shape);

  return ENV.engine.runKernel(backend => backend.equal($a, $b), {$a, $b}) as T;
}

function equalStrict_<T extends Tensor>(a: T|TensorLike, b: T|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'equalStrict');
  const $b = convertToTensor(b, 'b', 'equalStrict');
  assertShapesMatch($a.shape, $b.shape, 'Error in equalStrict: ');
  return $a.equal($b);
}

/**
 * Returns the truth value of (a <= b) element-wise. Supports broadcasting.
 *
 * We also expose `tf.lessEqualStrict` which has the same signature as this op
 * and asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([2, 2, 2]);
 *
 * a.lessEqual(b).print();
 * ```
 *
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 */
/** @doc {heading: 'Operations', subheading: 'Logical'} */
function lessEqual_<T extends Tensor>(
    a: Tensor|TensorLike, b: Tensor|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'lessEqual');
  const $b = convertToTensor(b, 'b', 'lessEqual');
  assertTypesMatch($a, $b);
  assertAndGetBroadcastShape($a.shape, $b.shape);

  return ENV.engine.runKernel(backend => backend.lessEqual($a, $b), {$a, $b}) as
      T;
}

function lessEqualStrict_<T extends Tensor>(
    a: T|TensorLike, b: T|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'lessEqualStrict');
  const $b = convertToTensor(b, 'b', 'lessEqualStrict');
  assertShapesMatch($a.shape, $b.shape, 'Error in lessEqualStrict: ');
  return $a.lessEqual($b);
}

/**
 * Returns the truth value of (a > b) element-wise. Supports broadcasting.
 *
 * We also expose `tf.greaterStrict` which has the same signature as this
 * op and asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([2, 2, 2]);
 *
 * a.greater(b).print();
 * ```
 *
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 */
/** @doc {heading: 'Operations', subheading: 'Logical'} */
function greater_<T extends Tensor>(
    a: Tensor|TensorLike, b: Tensor|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'greater');
  const $b = convertToTensor(b, 'b', 'greater');
  assertTypesMatch($a, $b);
  assertAndGetBroadcastShape($a.shape, $b.shape);

  return ENV.engine.runKernel(backend => backend.greater($a, $b), {$a, $b}) as
      T;
}

function greaterStrict_<T extends Tensor>(a: T|TensorLike, b: T|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'greaterStrict');
  const $b = convertToTensor(b, 'b', 'greaterStrict');
  assertShapesMatch($a.shape, $b.shape, 'Error in greaterStrict: ');
  return $a.greater($b);
}

/**
 * Returns the truth value of (a >= b) element-wise. Supports broadcasting.
 *
 * We also expose `tf.greaterEqualStrict` which has the same signature as this
 * op and asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([2, 2, 2]);
 *
 * a.greaterEqual(b).print();
 * ```
 *
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 */
/** @doc {heading: 'Operations', subheading: 'Logical'} */
function greaterEqual_<T extends Tensor>(
    a: Tensor|TensorLike, b: Tensor|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'greaterEqual');
  const $b = convertToTensor(b, 'b', 'greaterEqual');
  assertTypesMatch($a, $b);
  assertAndGetBroadcastShape($a.shape, $b.shape);

  const grad = (dy: T) => {
    return {$a: () => zerosLike($a), $b: () => zerosLike($b)};
  };
  return ENV.engine.runKernel(
             backend => backend.greaterEqual($a, $b), {$a, $b}, grad) as T;
}

function greaterEqualStrict_<T extends Tensor>(
    a: T|TensorLike, b: T|TensorLike): T {
  const $a = convertToTensor(a, 'a', 'greaterEqualStrict');
  const $b = convertToTensor(b, 'b', 'greaterEqualStrict');
  assertShapesMatch($a.shape, $b.shape, 'Error in greaterEqualStrict: ');
  return $a.greaterEqual($b);
}

export const equal = op({equal_});
export const equalStrict = op({equalStrict_});
export const greater = op({greater_});
export const greaterEqual = op({greaterEqual_});
export const greaterEqualStrict = op({greaterEqualStrict_});
export const greaterStrict = op({greaterStrict_});
export const less = op({less_});
export const lessEqual = op({lessEqual_});
export const lessEqualStrict = op({lessEqualStrict_});
export const lessStrict = op({lessStrict_});
export const notEqual = op({notEqual_});
export const notEqualStrict = op({notEqualStrict_});
