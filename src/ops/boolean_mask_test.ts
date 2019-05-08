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

import * as tf from '../index';
import {ALL_ENVS, describeWithFlags} from '../jasmine_util';
import {expectArraysClose} from '../test_util';

describeWithFlags('booleanMask', ALL_ENVS, () => {
  it('1d array, 1d mask, default axis', async () => {
    const array = tf.tensor1d([1, 2, 3], 'float32');
    const mask = tf.tensor1d([1, 0, 1], 'bool');
    const result = tf.booleanMask(array, mask);
    expect(result.shape).toEqual([2]);
    expect(result.dtype).toBe('float32');
    expectArraysClose(await result.data(), [1, 3]);
  });

  it('2d array, 1d mask, default axis', async () => {
    const array = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2], 'float32');
    const mask = tf.tensor1d([1, 0, 1], 'bool');
    const result = tf.booleanMask(array, mask);
    expect(result.shape).toEqual([2, 2]);
    expect(result.dtype).toBe('float32');
    expectArraysClose(await result.data(), [1, 2, 5, 6]);
  });

  it('2d array, 2d mask, default axis', async () => {
    const array = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2], 'float32');
    const mask = tf.tensor2d([1, 0, 1, 0, 1, 0], [3, 2], 'bool');
    const result = tf.booleanMask(array, mask);
    expect(result.shape).toEqual([3]);
    expect(result.dtype).toBe('float32');
    expectArraysClose(await result.data(), [1, 3, 5]);
  });

  it('2d array, 1d mask, axis=1', async () => {
    const array = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2], 'float32');
    const mask = tf.tensor1d([0, 1], 'bool');
    const axis = 1;
    const result = tf.booleanMask(array, mask, axis);
    expect(result.shape).toEqual([3, 1]);
    expect(result.dtype).toBe('float32');
    expectArraysClose(await result.data(), [2, 4, 6]);
  });

  it('accepts tensor-like object as array and mask', async () => {
    const array = [[1, 2], [3, 4], [5, 6]];
    const mask = [1, 0, 1];
    const result = tf.booleanMask(array, mask);
    expect(result.shape).toEqual([2, 2]);
    expect(result.dtype).toBe('float32');
    expectArraysClose(await result.data(), [1, 2, 5, 6]);
  });

  it('should throw if mask is scalar', async () => {
    const array = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2], 'float32');
    const mask = tf.scalar(1);
    expect(() => tf.booleanMask(array, mask)).toThrowError();
  });

  it('should throw if array and mask shape miss match', async () => {
    const array = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2], 'float32');
    const mask = tf.tensor2d([1, 0], [1, 2], 'float32');
    expect(() => tf.booleanMask(array, mask)).toThrowError();
  });
});