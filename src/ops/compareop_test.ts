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
// tslint:disable-next-line:max-line-length
import {ALL_ENVS, expectArraysClose, expectArraysEqual} from '../test_util';
import {describeWithFlags} from '../jasmine_util';

describeWithFlags('equal', ALL_ENVS, () => {
  it('Tensor1D - int32', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([2, 3, 5], 'int32');

    expectArraysClose(tf.equal(a, b), [0, 0, 1]);

    a = tf.tensor1d([2, 2, 2], 'int32');
    b = tf.tensor1d([2, 2, 2], 'int32');
    expectArraysClose(tf.equal(a, b), [1, 1, 1]);

    a = tf.tensor1d([0, 0], 'int32');
    b = tf.tensor1d([3, 3], 'int32');
    expectArraysClose(tf.equal(a, b), [0, 0]);
  });
  it('Tensor1D - float32', () => {
    let a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    let b = tf.tensor1d([2.2, 3.2, 5.1], 'float32');

    expectArraysClose(tf.equal(a, b), [0, 0, 1]);

    a = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    b = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    expectArraysClose(tf.equal(a, b), [1, 1, 1]);

    a = tf.tensor1d([0.45, 0.123], 'float32');
    b = tf.tensor1d([3.123, 3.321], 'float32');
    expectArraysClose(tf.equal(a, b), [0, 0]);
  });
  it('mismatched Tensor1D shapes - int32', () => {
    const a = tf.tensor1d([1, 2], 'int32');
    const b = tf.tensor1d([1, 2, 3], 'int32');
    const f = () => {
      tf.equal(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatched Tensor1D shapes - float32', () => {
    const a = tf.tensor1d([1.1, 2.1], 'float32');
    const b = tf.tensor1d([1.1, 2.1, 3.1], 'float32');
    const f = () => {
      tf.equal(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([2.1, 3.1, NaN], 'float32');
    expectArraysClose(tf.equal(a, b), [0, 0, 0]);
  });
  it('scalar and 1D broadcast', () => {
    const a = tf.scalar(2);
    const b = tf.tensor1d([1, 2, 3, 4, 5, 2]);
    const res = tf.equal(a, b);
    expect(res.dtype).toBe('bool');
    expect(res.shape).toEqual([6]);
    expectArraysEqual(res, [0, 1, 0, 0, 0, 1]);
  });

  // Tensor2D:
  it('Tensor2D - int32', () => {
    let a = tf.tensor2d([[1, 4, 5], [8, 9, 12]], [2, 3], 'int32');
    let b = tf.tensor2d([[2, 3, 6], [7, 10, 11]], [2, 3], 'int32');
    expectArraysClose(tf.equal(a, b), [0, 0, 0, 0, 0, 0]);

    a = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    b = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    expectArraysClose(tf.equal(a, b), [1, 1, 1, 1]);
  });
  it('Tensor2D - float32', () => {
    let a =
        tf.tensor2d([[1.1, 4.1, 5.1], [8.1, 9.1, 12.1]], [2, 3], 'float32');
    let b =
        tf.tensor2d([[2.1, 4.1, 5.1], [7.1, 10.1, 11.1]], [2, 3], 'float32');
    expectArraysClose(tf.equal(a, b), [0, 1, 1, 0, 0, 0]);

    a = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    b = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    expectArraysClose(tf.equal(a, b), [1, 1, 1, 1]);
  });
  it('broadcasting Tensor2D shapes - int32', () => {
    const a = tf.tensor2d([[3], [7]], [2, 1], 'int32');
    const b = tf.tensor2d([[2, 3, 4], [7, 8, 9]], [2, 3], 'int32');
    expectArraysClose(tf.equal(a, b), [0, 1, 0, 1, 0, 0]);
  });
  it('broadcasting Tensor2D shapes - float32', () => {
    const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
    const b =
        tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');
    expectArraysClose(tf.equal(a, b), [0, 1, 0, 1, 0, 0]);
  });
  it('NaNs in Tensor2D - float32', () => {
    const a = tf.tensor2d([[1.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    const b = tf.tensor2d([[0.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    expectArraysClose(tf.equal(a, b), [0, 0, 1, 0]);
  });
  it('2D and 2D broadcast each with 1 dim', () => {
    const a = tf.tensor2d([1, 2, 5], [1, 3]);
    const b = tf.tensor2d([5, 1], [2, 1]);
    const res = tf.equal(a, b);
    expect(res.dtype).toBe('bool');
    expect(res.shape).toEqual([2, 3]);
    expectArraysEqual(res, [0, 0, 1, 1, 0, 0]);
  });
  it('2D and scalar broadcast', () => {
    const a = tf.tensor2d([1, 2, 3, 2, 5, 6], [2, 3]);
    const b = tf.scalar(2);
    const res = tf.equal(a, b);
    expect(res.dtype).toBe('bool');
    expect(res.shape).toEqual([2, 3]);
    expectArraysEqual(res, [0, 1, 0, 1, 0, 0]);
  });

  // Tensor3D:
  it('Tensor3D - int32', () => {
    let a =
        tf.tensor3d([[[1], [4], [5]], [[8], [9], [12]]], [2, 3, 1], 'int32');
    let b =
        tf.tensor3d(
          [[[2], [3], [6]], [[7], [10], [12]]], [2, 3, 1], 'int32');
    expectArraysClose(tf.equal(a, b), [0, 0, 0, 0, 0, 1]);

    a = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    b = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    expectArraysClose(tf.equal(a, b), [1, 1, 1, 1, 1, 1]);
  });
  it('Tensor3D - float32', () => {
    let a = tf.tensor3d([[[1.1], [4.1], [5.1]], [[8.1], [9.1], [12.1]]],
      [2, 3, 1], 'float32');
    let b = tf.tensor3d(
        [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [12.1]]],
        [2, 3, 1],
        'float32');
    expectArraysClose(tf.equal(a, b), [0, 0, 0, 0, 0, 1]);

    a = tf.tensor3d(
      [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1],'float32');
    b = tf.tensor3d(
      [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    expectArraysClose(tf.equal(a, b), [1, 1, 1, 1, 1, 1]);
  });
  it('broadcasting Tensor3D shapes - int32', () => {
    const a = tf.tensor3d(
      [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]],
      [2, 3, 2], 'int32');
    const b =
        tf.tensor3d([[[1], [2], [3]], [[7], [10], [9]]], [2, 3, 1], 'int32');
    expectArraysClose(
        tf.equal(a, b), [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
  });
  it('broadcasting Tensor3D shapes - float32', () => {
    const a = tf.tensor3d(
        [
          [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
          [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
        ],
        [2, 3, 2],
        'float32');
    const b = tf.tensor3d(
        [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
        [2, 3, 1],
        'float32');
    expectArraysClose(
        tf.equal(a, b), [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
  });
  it('NaNs in Tensor3D - float32', () => {
    const a = tf.tensor3d(
        [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], [2, 3, 1], 'float32');
    const b = tf.tensor3d(
      [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], [2, 3, 1], 'float32');
    expectArraysClose(
        tf.equal(a, b), [0, 0, 1, 0, 1, 0]);
  });
  it('3D and scalar', () => {
    const a = tf.tensor3d([1, 2, 3, 4, 5, -1], [2, 3, 1]);
    const b = tf.scalar(-1);
    const res = tf.equal(a, b);
    expect(res.dtype).toBe('bool');
    expect(res.shape).toEqual([2, 3, 1]);
    expectArraysEqual(res, [0, 0, 0, 0, 0, 1]);
  });

  // Tensor4D:
  it('Tensor4D - int32', () => {
    let a = tf.tensor4d([1, 4, 5, 8], [2, 2, 1, 1], 'int32');
    let b = tf.tensor4d([2, 3, 6, 8], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.equal(a, b), [0, 0, 0, 1]);

    a = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.equal(a, b), [1, 1, 1, 1]);

    a = tf.tensor4d([1, 1, 1, 1], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([2, 2, 2, 2], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.equal(a, b), [0, 0, 0, 0]);
  });
  it('Tensor4D - float32', () => {
    let a = tf.tensor4d([1.1, 4.1, 5.1, 8.1], [2, 2, 1, 1], 'float32');
    let b = tf.tensor4d([2.1, 3.1, 6.1, 8.1], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.equal(a, b), [0, 0, 0, 1]);

    a = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.equal(a, b), [1, 1, 1, 1]);

    a = tf.tensor4d([0.1, 0.1, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([1.1, 1.1, 1.1, 1.1], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.equal(a, b), [0, 0, 0, 0]);
  });
  it('broadcasting Tensor4D shapes - int32', () => {
    const a = tf.tensor4d([1, 2, 5, 9], [2, 2, 1, 1], 'int32');
    const b = tf.tensor4d(
        [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], [2, 2, 1, 2], 'int32');
    expectArraysClose(tf.equal(a, b), [1, 0, 0, 0, 1, 0, 0, 0]);
  });
  it('broadcasting Tensor4D shapes - float32', () => {
    const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d(
        [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
        [2, 2, 1, 2],
        'float32');
    expectArraysClose(tf.equal(a, b), [1, 0, 0, 0, 1, 0, 0, 0]);
  });
  it('NaNs in Tensor4D - float32', () => {
      const a = tf.tensor4d([1.1, NaN, 1.1, 0.1], [2, 2, 1, 1], 'float32');
      const b = tf.tensor4d([0.1, 1.1, 1.1, NaN], [2, 2, 1, 1], 'float32');
      expectArraysClose(tf.equal(a, b), [0, 0, 1, 0]);
  });

  it('throws when passed a as a non-tensor', () => {
    expect(() => tf.equal({} as tf.Tensor, tf.scalar(1)))
        .toThrowError(/Argument 'a' passed to 'equal' must be a Tensor/);
  });
  it('throws when passed b as a non-tensor', () => {
    expect(() => tf.equal(tf.scalar(1), {} as tf.Tensor))
        .toThrowError(/Argument 'b' passed to 'equal' must be a Tensor/);
  });
});

describeWithFlags('equalStrict', ALL_ENVS, () => {
  it('Tensor1D - int32', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([2, 3, 5], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 1]);

    a = tf.tensor1d([2, 2, 2], 'int32');
    b = tf.tensor1d([2, 2, 2], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [1, 1, 1]);

    a = tf.tensor1d([0, 0], 'int32');
    b = tf.tensor1d([3, 3], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0]);
  });
  it('Tensor1D - float32', () => {
    let a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    let b = tf.tensor1d([2.2, 3.2, 5.1], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 1]);

    a = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    b = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [1, 1, 1]);

    a = tf.tensor1d([0.45, 0.123], 'float32');
    b = tf.tensor1d([3.123, 3.321], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0]);
  });
  it('mismatched Tensor1D shapes - int32', () => {
    const a = tf.tensor1d([1, 2], 'int32');
    const b = tf.tensor1d([1, 2, 3], 'int32');
    const f = () => {
      tf.equalStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatched Tensor1D shapes - float32', () => {
    const a = tf.tensor1d([1.1, 2.1], 'float32');
    const b = tf.tensor1d([1.1, 2.1, 3.1], 'float32');
    const f = () => {
      tf.equalStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([2.1, 3.1, NaN], 'float32');
    expectArraysClose(
        tf.equalStrict(a, b), [0, 0, 0]);
  });

  // Tensor2D:
  it('Tensor2D - int32', () => {
    let a = tf.tensor2d([[1, 4, 5], [8, 9, 12]], [2, 3], 'int32');
    let b = tf.tensor2d([[2, 3, 6], [7, 10, 11]], [2, 3], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 0, 0, 0, 0]);

    a = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    b = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [1, 1, 1, 1]);
  });
  it('Tensor2D - float32', () => {
    let a =
        tf.tensor2d([[1.1, 4.1, 5.1], [8.1, 9.1, 12.1]], [2, 3], 'float32');
    let b =
        tf.tensor2d([[2.1, 4.1, 5.1], [7.1, 10.1, 11.1]], [2, 3], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [0, 1, 1, 0, 0, 0]);

    a = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    b = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [1, 1, 1, 1]);
  });
  it('mismatch Tensor2D shapes - int32', () => {
    const a = tf.tensor2d([[3], [7]], [2, 1], 'int32');
    const b = tf.tensor2d([[2, 3, 4], [7, 8, 9]], [2, 3], 'int32');

    const f = () => {
      tf.equalStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatch Tensor2D shapes - float32', () => {
    const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
    const b =
        tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');
    const f = () => {
      tf.equalStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor2D - float32', () => {
    const a = tf.tensor2d([[1.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    const b = tf.tensor2d([[0.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    expectArraysClose(
        tf.equalStrict(a, b), [0, 0, 1, 0]);
  });

  // Tensor3D:
  it('Tensor3D - int32', () => {
    let a =
        tf.tensor3d([[[1], [4], [5]], [[8], [9], [12]]], [2, 3, 1], 'int32');
    let b =
        tf.tensor3d([[[2], [3], [6]], [[7], [10], [12]]], [2, 3, 1], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 0, 0, 0, 1]);

    a = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    b = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [1, 1, 1, 1, 1, 1]);
  });
  it('Tensor3D - float32', () => {
    let a = tf.tensor3d(
        [[[1.1], [4.1], [5.1]], [[8.1], [9.1], [12.1]]],
        [2, 3, 1],
        'float32');
    let b = tf.tensor3d(
        [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [12.1]]],
        [2, 3, 1],
        'float32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 0, 0, 0, 1]);

    a = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    b = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [1, 1, 1, 1, 1, 1]);
  });
  it('mismatch Tensor3D shapes - int32', () => {
    const a = tf.tensor3d(
        [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]],
        [2, 3, 2],
        'int32');
    const b =
        tf.tensor3d([[[1], [2], [3]], [[7], [10], [9]]], [2, 3, 1], 'int32');

    const f = () => {
      tf.equalStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatch Tensor3D shapes - float32', () => {
    const a = tf.tensor3d(
        [
          [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
          [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
        ],
        [2, 3, 2],
        'float32');
    const b = tf.tensor3d(
        [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
        [2, 3, 1],
        'float32');

    const f = () => {
      tf.equalStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor3D - float32', () => {
    const a = tf.tensor3d(
       [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], [2, 3, 1], 'float32');
    const b = tf.tensor3d(
        [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], [2, 3, 1], 'float32');
    expectArraysClose(
        tf.equalStrict(a, b), [0, 0, 1, 0, 1, 0]);
  });

  // Tensor4D:
  it('Tensor4D - int32', () => {
    let a = tf.tensor4d([1, 4, 5, 8], [2, 2, 1, 1], 'int32');
    let b = tf.tensor4d([2, 3, 6, 8], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 0, 1]);

    a = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [1, 1, 1, 1]);

    a = tf.tensor4d([1, 1, 1, 1], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([2, 2, 2, 2], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 0, 0]);
  });
  it('Tensor4D - float32', () => {
    let a = tf.tensor4d([1.1, 4.1, 5.1, 8.1], [2, 2, 1, 1], 'float32');
    let b = tf.tensor4d([2.1, 3.1, 6.1, 8.1], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 0, 1]);

    a = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [1, 1, 1, 1]);

    a = tf.tensor4d([0.1, 0.1, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([1.1, 1.1, 1.1, 1.1], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.equalStrict(a, b), [0, 0, 0, 0]);
  });
  it('mismatch Tensor4D shapes - int32', () => {
    const a = tf.tensor4d([1, 2, 5, 9], [2, 2, 1, 1], 'int32');
    const b = tf.tensor4d(
        [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], [2, 2, 1, 2], 'int32');

    const f = () => {
      tf.equalStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatch Tensor4D shapes - float32', () => {
    const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d(
        [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
        [2, 2, 1, 2], 'float32');

    const f = () => {
      tf.equalStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor4D - float32', () => {
    const a = tf.tensor4d([1.1, NaN, 1.1, 0.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d([0.1, 1.1, 1.1, NaN], [2, 2, 1, 1], 'float32');
    expectArraysClose(
        tf.equalStrict(a, b), [0, 0, 1, 0]);
  });
});

describeWithFlags('notEqual', ALL_ENVS, () => {
  it('Tensor1D - int32', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([2, 3, 5], 'int32');

    expectArraysClose(tf.notEqual(a, b), [1, 1, 0]);

    a = tf.tensor1d([2, 2, 2], 'int32');
    b = tf.tensor1d([2, 2, 2], 'int32');
    expectArraysClose(tf.notEqual(a, b), [0, 0, 0]);

    a = tf.tensor1d([0, 0], 'int32');
    b = tf.tensor1d([3, 3], 'int32');
    expectArraysClose(tf.notEqual(a, b), [1, 1]);
  });
  it('Tensor1D - float32', () => {
    let a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    let b = tf.tensor1d([2.2, 3.2, 5.1], 'float32');

    expectArraysClose(tf.notEqual(a, b), [1, 1, 0]);

    a = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    b = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    expectArraysClose(tf.notEqual(a, b), [0, 0, 0]);

    a = tf.tensor1d([0.45, 0.123], 'float32');
    b = tf.tensor1d([3.123, 3.321], 'float32');
    expectArraysClose(tf.notEqual(a, b), [1, 1]);
  });
  it('mismatched Tensor1D shapes - int32', () => {
    const a = tf.tensor1d([1, 2], 'int32');
    const b = tf.tensor1d([1, 2, 3], 'int32');
    const f = () => {
      tf.notEqual(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatched Tensor1D shapes - float32', () => {
    const a = tf.tensor1d([1.1, 2.1], 'float32');
    const b = tf.tensor1d([1.1, 2.1, 3.1], 'float32');
    const f = () => {
      tf.notEqual(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([2.1, 3.1, NaN], 'float32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 1]);
  });
  it('works with NaNs', () => {
    const a = tf.tensor1d([2, 5, NaN]);
    const b = tf.tensor1d([4, 5, -1]);

    const res = tf.notEqual(a, b);
    expect(res.dtype).toBe('bool');
    expectArraysEqual(res, [1, 0, 1]);
  });
  it('scalar and 1D broadcast', () => {
    const a = tf.scalar(2);
    const b = tf.tensor1d([1, 2, 3, 4, 5, 2]);
    const res = tf.notEqual(a, b);
    expect(res.dtype).toBe('bool');
    expect(res.shape).toEqual([6]);
    expectArraysEqual(res, [1, 0, 1, 1, 1, 0]);
  });

  // Tensor2D:
  it('Tensor2D - int32', () => {
    let a = tf.tensor2d([[1, 4, 5], [8, 9, 12]], [2, 3], 'int32');
    let b = tf.tensor2d([[2, 3, 6], [7, 10, 11]], [2, 3], 'int32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 1, 1, 1, 1]);

    a = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    b = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    expectArraysClose(tf.notEqual(a, b), [0, 0, 0, 0]);
  });
  it('Tensor2D - float32', () => {
    let a =
        tf.tensor2d([[1.1, 4.1, 5.1], [8.1, 9.1, 12.1]], [2, 3], 'float32');
    let b =
        tf.tensor2d([[2.1, 4.1, 5.1], [7.1, 10.1, 11.1]], [2, 3], 'float32');
    expectArraysClose(tf.notEqual(a, b), [1, 0, 0, 1, 1, 1]);

    a = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    b = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    expectArraysClose(tf.notEqual(a, b), [0, 0, 0, 0]);
  });
  it('broadcasting Tensor2D shapes - int32', () => {
    const a = tf.tensor2d([[3], [7]], [2, 1], 'int32');
    const b = tf.tensor2d([[2, 3, 4], [7, 8, 9]], [2, 3], 'int32');
    expectArraysClose(tf.notEqual(a, b), [1, 0, 1, 0, 1, 1]);
  });
  it('broadcasting Tensor2D shapes - float32', () => {
    const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
    const b =
        tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');
    expectArraysClose(tf.notEqual(a, b), [1, 0, 1, 0, 1, 1]);
  });
  it('NaNs in Tensor2D - float32', () => {
    const a = tf.tensor2d([[1.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    const b = tf.tensor2d([[0.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 0, 1]);
  });
  it('2D and scalar broadcast', () => {
    const a = tf.tensor2d([1, 2, 3, 2, 5, 6], [2, 3]);
    const b = tf.scalar(2);
    const res = tf.notEqual(a, b);
    expect(res.dtype).toBe('bool');
    expect(res.shape).toEqual([2, 3]);
    expectArraysEqual(res, [1, 0, 1, 0, 1, 1]);
  });
  it('2D and 2D broadcast each with 1 dim', () => {
    const a = tf.tensor2d([1, 2, 5], [1, 3]);
    const b = tf.tensor2d([5, 1], [2, 1]);
    const res = tf.notEqual(a, b);
    expect(res.dtype).toBe('bool');
    expect(res.shape).toEqual([2, 3]);
    expectArraysEqual(res, [1, 1, 0, 0, 1, 1]);
  });

  // Tensor3D:
  it('Tensor3D - int32', () => {
    let a =
        tf.tensor3d([[[1], [4], [5]], [[8], [9], [12]]], [2, 3, 1], 'int32');
    let b =
        tf.tensor3d(
          [[[2], [3], [6]], [[7], [10], [12]]], [2, 3, 1], 'int32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 1, 1, 1, 0]);

    a = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    b = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    expectArraysClose(tf.notEqual(a, b), [0, 0, 0, 0, 0, 0]);
  });
  it('Tensor3D - float32', () => {
    let a = tf.tensor3d(
        [[[1.1], [4.1], [5.1]], [[8.1], [9.1], [12.1]]],
        [2, 3, 1],
        'float32');
    let b = tf.tensor3d(
        [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [12.1]]],
        [2, 3, 1],
        'float32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 1, 1, 1, 0]);

    a = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]],
        [2, 3, 1],
        'float32');
    b = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]],
        [2, 3, 1],
        'float32');
    expectArraysClose(tf.notEqual(a, b), [0, 0, 0, 0, 0, 0]);
  });
  it('broadcasting Tensor3D shapes - int32', () => {
    const a = tf.tensor3d(
        [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]],
        [2, 3, 2],
        'int32');
    const b =
        tf.tensor3d([[[1], [2], [3]], [[7], [10], [9]]], [2, 3, 1], 'int32');
    expectArraysClose(
        tf.notEqual(a, b), [0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1]);
  });
  it('broadcasting Tensor3D shapes - float32', () => {
    const a = tf.tensor3d(
        [
          [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
          [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
        ],
        [2, 3, 2],
        'float32');
    const b = tf.tensor3d(
        [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
        [2, 3, 1],
        'float32');
    expectArraysClose(
        tf.notEqual(a, b), [0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1]);
  });
  it('NaNs in Tensor3D - float32', () => {
    const a = tf.tensor3d(
        [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], [2, 3, 1], 'float32');
    const b = tf.tensor3d(
        [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], [2, 3, 1] ,'float32');
    expectArraysClose(
        tf.notEqual(a, b), [1, 1, 0, 1, 0, 1]);
  });
  it('3D and scalar', () => {
    const a = tf.tensor3d([1, 2, 3, 4, 5, -1], [2, 3, 1]);
    const b = tf.scalar(-1);
    const res = tf.notEqual(a, b);
    expect(res.dtype).toBe('bool');
    expect(res.shape).toEqual([2, 3, 1]);
    expectArraysEqual(res, [1, 1, 1, 1, 1, 0]);
  });

  // Tensor4D:
  it('Tensor4D - int32', () => {
    let a = tf.tensor4d([1, 4, 5, 8], [2, 2, 1, 1], 'int32');
    let b = tf.tensor4d([2, 3, 6, 8], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 1, 0]);

    a = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.notEqual(a, b), [0, 0, 0, 0]);

    a = tf.tensor4d([1, 1, 1, 1], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([2, 2, 2, 2], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 1, 1]);
  });
  it('Tensor4D - float32', () => {
    let a = tf.tensor4d([1.1, 4.1, 5.1, 8.1], [2, 2, 1, 1], 'float32');
    let b = tf.tensor4d([2.1, 3.1, 6.1, 8.1], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 1, 0]);

    a = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.notEqual(a, b), [0, 0, 0, 0]);

    a = tf.tensor4d([0.1, 0.1, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([1.1, 1.1, 1.1, 1.1], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.notEqual(a, b), [1, 1, 1, 1]);
  });
  it('broadcasting Tensor4D shapes - int32', () => {
    const a = tf.tensor4d([1, 2, 5, 9], [2, 2, 1, 1], 'int32');
    const b = tf.tensor4d(
        [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], [2, 2, 1, 2], 'int32');
    expectArraysClose(
        tf.notEqual(a, b), [0, 1, 1, 1, 0, 1, 1, 1]);
  });
  it('broadcasting Tensor4D shapes - float32', () => {
    const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d(
        [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
        [2, 2, 1, 2],
        'float32');
    expectArraysClose(
        tf.notEqual(a, b), [0, 1, 1, 1, 0, 1, 1, 1]);
  });
  it('NaNs in Tensor4D - float32', () => {
    const a = tf.tensor4d([1.1, NaN, 1.1, 0.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d([0.1, 1.1, 1.1, NaN], [2, 2, 1, 1], 'float32');
    expectArraysClose(
        tf.notEqual(a, b), [1, 1, 0, 1]);
  });

  it('throws when passed a as a non-tensor', () => {
    expect(() => tf.notEqual({} as tf.Tensor, tf.scalar(1)))
        .toThrowError(/Argument 'a' passed to 'notEqual' must be a Tensor/);
  });
  it('throws when passed b as a non-tensor', () => {
    expect(() => tf.notEqual(tf.scalar(1), {} as tf.Tensor))
        .toThrowError(/Argument 'b' passed to 'notEqual' must be a Tensor/);
  });
});

describeWithFlags('notEqualStrict', ALL_ENVS, () => {
  it('Tensor1D - int32', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([2, 3, 5], 'int32');
    expectArraysClose(tf.notEqualStrict(a, b), [1, 1, 0]);

    a = tf.tensor1d([2, 2, 2], 'int32');
    b = tf.tensor1d([2, 2, 2], 'int32');
    expectArraysClose(tf.notEqualStrict(a, b), [0, 0, 0]);

    a = tf.tensor1d([0, 0], 'int32');
    b = tf.tensor1d([3, 3], 'int32');
    expectArraysClose(tf.notEqualStrict(a, b), [1, 1]);
  });
  it('Tensor1D - float32', () => {
    let a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    let b = tf.tensor1d([2.2, 3.2, 5.1], 'float32');
    expectArraysClose(tf.notEqualStrict(a, b), [1, 1, 0]);

    a = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    b = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    expectArraysClose(tf.notEqualStrict(a, b), [0, 0, 0]);

    a = tf.tensor1d([0.45, 0.123], 'float32');
    b = tf.tensor1d([3.123, 3.321], 'float32');
    expectArraysClose(tf.notEqualStrict(a, b), [1, 1]);
  });
  it('mismatched Tensor1D shapes - int32', () => {
    const a = tf.tensor1d([1, 2], 'int32');
    const b = tf.tensor1d([1, 2, 3], 'int32');
    const f = () => {
      tf.notEqualStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatched Tensor1D shapes - float32', () => {
    const a = tf.tensor1d([1.1, 2.1], 'float32');
    const b = tf.tensor1d([1.1, 2.1, 3.1], 'float32');
    const f = () => {
      tf.notEqualStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([2.1, 3.1, NaN], 'float32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [1, 1, 1]);
  });
  it('strict version throws when x and y are different shape', () => {
    const a = tf.tensor1d([2]);
    const b = tf.tensor1d([4, 2, -1]);

    expect(() => tf.notEqualStrict(a, b)).toThrowError();
    expect(() => tf.notEqualStrict(b, a)).toThrowError();
  });

  // Tensor2D:
  it('Tensor2D - int32', () => {
    let a = tf.tensor2d([[1, 4, 5], [8, 9, 12]], [2, 3], 'int32');
    let b = tf.tensor2d([[2, 3, 6], [7, 10, 11]], [2, 3], 'int32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [1, 1, 1, 1, 1, 1]);

    a = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    b = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    expectArraysClose(tf.notEqualStrict(a, b), [0, 0, 0, 0]);
  });
  it('Tensor2D - float32', () => {
    let a =
        tf.tensor2d([[1.1, 4.1, 5.1], [8.1, 9.1, 12.1]], [2, 3], 'float32');
    let b =
        tf.tensor2d([[2.1, 4.1, 5.1], [7.1, 10.1, 11.1]], [2, 3], 'float32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [1, 0, 0, 1, 1, 1]);

    a = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    b = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    expectArraysClose(tf.notEqualStrict(a, b), [0, 0, 0, 0]);
  });
  it('mismatch Tensor2D shapes - int32', () => {
    const a = tf.tensor2d([[3], [7]], [2, 1], 'int32');
    const b = tf.tensor2d([[2, 3, 4], [7, 8, 9]], [2, 3], 'int32');

    const f = () => {
      tf.notEqualStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatch Tensor2D shapes - float32', () => {
    const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
    const b =
        tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');
    const f = () => {
      tf.notEqualStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor2D - float32', () => {
    const a = tf.tensor2d([[1.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    const b = tf.tensor2d([[0.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [1, 1, 0, 1]);
  });

  // Tensor3D:
  it('Tensor3D - int32', () => {
    let a =
        tf.tensor3d([[[1], [4], [5]], [[8], [9], [12]]], [2, 3, 1], 'int32');
    let b =
        tf.tensor3d(
          [[[2], [3], [6]], [[7], [10], [12]]], [2, 3, 1], 'int32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [1, 1, 1, 1, 1, 0]);

    a = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    b = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [0, 0, 0, 0, 0, 0]);
  });
  it('Tensor3D - float32', () => {
    let a = tf.tensor3d(
        [[[1.1], [4.1], [5.1]], [[8.1], [9.1], [12.1]]], [2, 3, 1],
        'float32');
    let b = tf.tensor3d(
        [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [12.1]]], [2, 3, 1],
        'float32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [1, 1, 1, 1, 1, 0]);

    a = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    b = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [0, 0, 0, 0, 0, 0]);
  });
  it('mismatch Tensor3D shapes - int32', () => {
    const a = tf.tensor3d(
        [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]],
        [2, 3, 2],
        'int32');
    const b =
        tf.tensor3d([[[1], [2], [3]], [[7], [10], [9]]], [2, 3, 1], 'int32');

    const f = () => {
      tf.notEqualStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatch Tensor3D shapes - float32', () => {
    const a = tf.tensor3d(
        [
          [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
          [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
        ],
        [2, 3, 2],
        'float32');
    const b = tf.tensor3d(
        [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
        [2, 3, 1],
        'float32');

    const f = () => {
      tf.notEqualStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor3D - float32', () => {
    const a = tf.tensor3d(
        [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], [2, 3, 1], 'float32');
    const b = tf.tensor3d(
        [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], [2, 3, 1], 'float32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [1, 1, 0, 1, 0, 1]);
  });

  // Tensor4D:
  it('Tensor4D - int32', () => {
    let a = tf.tensor4d([1, 4, 5, 8], [2, 2, 1, 1], 'int32');
    let b = tf.tensor4d([2, 3, 6, 8], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.notEqualStrict(a, b), [1, 1, 1, 0]);

    a = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.notEqualStrict(a, b), [0, 0, 0, 0]);

    a = tf.tensor4d([1, 1, 1, 1], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([2, 2, 2, 2], [2, 2, 1, 1], 'int32');
    expectArraysClose(tf.notEqualStrict(a, b), [1, 1, 1, 1]);
  });
  it('Tensor4D - float32', () => {
    let a = tf.tensor4d([1.1, 4.1, 5.1, 8.1], [2, 2, 1, 1], 'float32');
    let b = tf.tensor4d([2.1, 3.1, 6.1, 8.1], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.notEqualStrict(a, b), [1, 1, 1, 0]);

    a = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.notEqualStrict(a, b), [0, 0, 0, 0]);

    a = tf.tensor4d([0.1, 0.1, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([1.1, 1.1, 1.1, 1.1], [2, 2, 1, 1], 'float32');
    expectArraysClose(tf.notEqualStrict(a, b), [1, 1, 1, 1]);
  });
  it('mismatch Tensor4D shapes - int32', () => {
    const a = tf.tensor4d([1, 2, 5, 9], [2, 2, 1, 1], 'int32');
    const b = tf.tensor4d(
        [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], [2, 2, 1, 2], 'int32');

    const f = () => {
      tf.notEqualStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatch Tensor4D shapes - float32', () => {
    const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d(
        [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
        [2, 2, 1, 2],
        'float32');

    const f = () => {
      tf.notEqualStrict(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor4D - float32', () => {
    const a = tf.tensor4d([1.1, NaN, 1.1, 0.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d([0.1, 1.1, 1.1, NaN], [2, 2, 1, 1], 'float32');
    expectArraysClose(
        tf.notEqualStrict(a, b), [1, 1, 0, 1]);
  });
});

describeWithFlags('less', ALL_ENVS, () => {
  it('Tensor1D - int32', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([2, 3, 5], 'int32');
    let res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0]);

    a = tf.tensor1d([2, 2, 2], 'int32');
    b = tf.tensor1d([2, 2, 2], 'int32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0]);

    a = tf.tensor1d([0, 0], 'int32');
    b = tf.tensor1d([3, 3], 'int32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1]);
  });
  it('Tensor1D - float32', () => {
    let a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    let b = tf.tensor1d([2.2, 3.2, 5.1], 'float32');
    let res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0]);

    a = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    b = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0]);

    a = tf.tensor1d([0.45, 0.123], 'float32');
    b = tf.tensor1d([3.123, 3.321], 'float32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1]);
  });
  it('mismatched Tensor1D shapes - int32', () => {
    const a = tf.tensor1d([1, 2], 'int32');
    const b = tf.tensor1d([1, 2, 3], 'int32');
    const f = () => {
      tf.less(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatched Tensor1D shapes - float32', () => {
    const a = tf.tensor1d([1.1, 2.1], 'float32');
    const b = tf.tensor1d([1.1, 2.1, 3.1], 'float32');
    const f = () => {
      tf.less(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([2.1, 3.1, NaN], 'float32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0]);
  });

  // Tensor2D:
  it('Tensor2D - int32', () => {
    let a = tf.tensor2d([[1, 4, 5], [8, 9, 12]], [2, 3], 'int32');
    let b = tf.tensor2d([[2, 3, 6], [7, 10, 11]], [2, 3], 'int32');
    let res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);

    a = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    b = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);
  });
  it('Tensor2D - float32', () => {
    let a =
        tf.tensor2d([[1.1, 4.1, 5.1], [8.1, 9.1, 12.1]], [2, 3], 'float32');
    let b =
        tf.tensor2d([[2.1, 3.1, 6.1], [7.1, 10.1, 11.1]], [2, 3], 'float32');
    let res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);

    a = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    b = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);
  });
  it('broadcasting Tensor2D shapes - int32', () => {
    const a = tf.tensor2d([[3], [7]], [2, 1], 'int32');
    const b = tf.tensor2d([[2, 3, 4], [7, 8, 9]], [2, 3], 'int32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 1, 0, 1, 1]);
  });
  it('broadcasting Tensor2D shapes - float32', () => {
    const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
    const b =
        tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 1, 0, 1, 1]);
  });
  it('NaNs in Tensor2D - float32', () => {
    const a = tf.tensor2d([[1.1, NaN], [0.1, NaN]], [2, 2], 'float32');
    const b = tf.tensor2d([[0.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 1, 0]);
  });

  // Tensor3D:
  it('Tensor3D - int32', () => {
    let a =
        tf.tensor3d([[[1], [4], [5]], [[8], [9], [12]]], [2, 3, 1], 'int32');
    let b =
        tf.tensor3d(
          [[[2], [3], [6]], [[7], [10], [11]]], [2, 3, 1], 'int32');
    let res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);

    a = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    b = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0, 0, 0]);
  });
  it('Tensor3D - float32', () => {
    let a = tf.tensor3d(
        [[[1.1], [4.1], [5.1]], [[8.1], [9.1], [12.1]]],
        [2, 3, 1],
        'float32');
    let b = tf.tensor3d(
        [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [11.1]]],
        [2, 3, 1],
        'float32');
    let res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);

    a = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.0]]], [2, 3, 1], 'float32');
    b = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0, 0, 1]);
  });
  it('broadcasting Tensor3D shapes - int32', () => {
    const a = tf.tensor3d(
        [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]],
        [2, 3, 2],
        'int32');
    const b =
        tf.tensor3d([[[1], [2], [3]], [[7], [10], [9]]], [2, 3, 1], 'int32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0]);
  });
  it('broadcasting Tensor3D float32', () => {
    const a = tf.tensor3d(
        [
          [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
          [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
        ],
        [2, 3, 2],
        'float32');
    const b = tf.tensor3d(
        [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
        [2, 3, 1],
        'float32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0]);
  });
  it('NaNs in Tensor3D - float32', () => {
    const a = tf.tensor3d(
        [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], [2, 3, 1], 'float32');
    const b = tf.tensor3d(
        [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], [2, 3, 1], 'float32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 1, 0, 0]);
  });

  // Tensor4D:
  it('Tensor4D - int32', () => {
    let a = tf.tensor4d([1, 4, 5, 8], [2, 2, 1, 1], 'int32');
    let b = tf.tensor4d([2, 3, 6, 7], [2, 2, 1, 1], 'int32');
    let res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0]);

    a = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);

    a = tf.tensor4d([1, 1, 1, 1], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([2, 2, 2, 2], [2, 2, 1, 1], 'int32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('Tensor4D - float32', () => {
    let a = tf.tensor4d([1.1, 4.1, 5.1, 8.1], [2, 2, 1, 1], 'float32');
    let b = tf.tensor4d([2.1, 3.1, 6.1, 7.1], [2, 2, 1, 1], 'float32');
    let res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0]);

    a = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);

    a = tf.tensor4d([0.1, 0.1, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([1.1, 1.1, 1.1, 1.1], [2, 2, 1, 1], 'float32');
    res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('broadcasting Tensor4D shapes - int32', () => {
    const a = tf.tensor4d([1, 2, 5, 9], [2, 2, 1, 1], 'int32');
    const b = tf.tensor4d(
        [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], [2, 2, 1, 2], 'int32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 1, 1, 0, 1, 0, 0]);
  });
  it('broadcasting Tensor4D shapes - float32', () => {
    const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d(
        [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
        [2, 2, 1, 2],
        'float32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 1, 1, 0, 1, 0, 0]);
  });
  it('NaNs in Tensor4D - float32', () => {
    const a = tf.tensor4d([1.1, NaN, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d([0.1, 1.1, 1.1, NaN], [2, 2, 1, 1], 'float32');
    const res = tf.less(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 1, 0]);
  });

  it('throws when passed a as a non-tensor', () => {
    expect(() => tf.less({} as tf.Tensor, tf.scalar(1)))
        .toThrowError(/Argument 'a' passed to 'less' must be a Tensor/);
  });
  it('throws when passed b as a non-tensor', () => {
    expect(() => tf.less(tf.scalar(1), {} as tf.Tensor))
        .toThrowError(/Argument 'b' passed to 'less' must be a Tensor/);
  });
});

describeWithFlags('lessStrict', ALL_ENVS, () => {
  it('Tensor1D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor1d([2]);
        const b = tf.tensor1d([4, 2, -1]);

        expect(() => tf.lessStrict(a, b)).toThrowError();
        expect(() => tf.lessStrict(b, a)).toThrowError();
      });

  // Tensor2D:
  it('Tensor2D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
        const b =
            tf.tensor2d(
            [[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');

        expect(() => tf.lessStrict(a, b)).toThrowError();
        expect(() => tf.lessStrict(b, a)).toThrowError();
      });

  // Tensor3D:
  it('Tensor3D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor3d(
            [
              [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
              [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
            ],
            [2, 3, 2],
            'float32');
        const b = tf.tensor3d(
            [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
            [2, 3, 1],
            'float32');

        expect(() => tf.lessStrict(a, b)).toThrowError();
        expect(() => tf.lessStrict(b, a)).toThrowError();
      });

  // Tensor4D:
  it('Tensor4D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
        const b = tf.tensor4d(
            [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
            [2, 2, 1, 2],
            'float32');

        expect(() => tf.lessStrict(a, b)).toThrowError();
        expect(() => tf.lessStrict(b, a)).toThrowError();
      });
});

describeWithFlags('lessEqual', ALL_ENVS, () => {
  it('Tensor1D - int32', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([2, 3, 5], 'int32');
    let res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1]);

    a = tf.tensor1d([2, 2, 2], 'int32');
    b = tf.tensor1d([2, 2, 2], 'int32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1]);

    a = tf.tensor1d([0, 0], 'int32');
    b = tf.tensor1d([3, 3], 'int32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1]);
  });
  it('Tensor1D - float32', () => {
    let a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    let b = tf.tensor1d([2.2, 3.2, 5.1], 'float32');
    let res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1]);

    a = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    b = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1]);

    a = tf.tensor1d([0.45, 0.123], 'float32');
    b = tf.tensor1d([3.123, 3.321], 'float32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1]);
  });
  it('mismatched Tensor1D shapes - int32', () => {
    const a = tf.tensor1d([1, 2], 'int32');
    const b = tf.tensor1d([1, 2, 3], 'int32');
    const f = () => {
      tf.lessEqual(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatched Tensor1D shapes - float32', () => {
    const a = tf.tensor1d([1.1, 2.1], 'float32');
    const b = tf.tensor1d([1.1, 2.1, 3.1], 'float32');
    const f = () => {
      tf.lessEqual(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([2.1, 3.1, NaN], 'float32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0]);
  });

  // Tensor2D:
  it('Tensor2D - int32', () => {
    let a = tf.tensor2d([[1, 4, 5], [8, 9, 12]], [2, 3], 'int32');
    let b = tf.tensor2d([[2, 3, 6], [7, 10, 11]], [2, 3], 'int32');
    let res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);

    a = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    b = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('Tensor2D - float32', () => {
    let a =
        tf.tensor2d([[1.1, 4.1, 5.1], [8.1, 9.1, 12.1]], [2, 3], 'float32');
    let b =
        tf.tensor2d([[2.1, 3.1, 6.1], [7.1, 10.1, 11.1]], [2, 3], 'float32');
    let res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);

    a = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    b = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('broadcasting Tensor2D shapes - int32', () => {
    const a = tf.tensor2d([[3], [7]], [2, 1], 'int32');
    const b = tf.tensor2d([[2, 3, 4], [7, 8, 9]], [2, 3], 'int32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 1, 1, 1, 1]);
  });
  it('broadcasting Tensor2D shapes - float32', () => {
    const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
    const b =
        tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 1, 1, 1, 1]);
  });
  it('NaNs in Tensor2D - float32', () => {
    const a = tf.tensor2d([[1.1, NaN], [0.1, NaN]], [2, 2], 'float32');
    const b = tf.tensor2d([[0.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 1, 0]);
  });

  // Tensor3D:
  it('Tensor3D - int32', () => {
    let a =
        tf.tensor3d([[[1], [4], [5]], [[8], [9], [12]]], [2, 3, 1], 'int32');
    let b =
        tf.tensor3d(
          [[[2], [3], [6]], [[7], [10], [11]]], [2, 3, 1], 'int32');
    let res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);

    a = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    b = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1, 1, 1]);
  });
  it('Tensor3D - float32', () => {
    let a = tf.tensor3d(
        [[[1.1], [4.1], [5.1]], [[8.1], [9.1], [12.1]]],
        [2, 3, 1],
        'float32');
    let b = tf.tensor3d(
        [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [11.1]]],
        [2, 3, 1],
        'float32');
    let res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);

    a = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.2]]], [2, 3, 1], 'float32');
    b = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1, 1, 0]);
  });
  it('broadcasting Tensor3D shapes - int32', () => {
    const a = tf.tensor3d(
        [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]], [2, 3, 2],
        'int32');
    const b =
        tf.tensor3d([[[1], [2], [3]], [[7], [10], [9]]], [2, 3, 1], 'int32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0]);
  });
  it('broadcasting Tensor3D float32', () => {
    const a = tf.tensor3d(
        [
          [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
          [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
        ],
        [2, 3, 2],
        'float32');
    const b = tf.tensor3d(
        [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
        [2, 3, 1],
        'float32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0]);
  });
  it('NaNs in Tensor3D - float32', () => {
    const a = tf.tensor3d(
        [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], [2, 3, 1], 'float32');
    const b = tf.tensor3d(
        [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], [2, 3, 1], 'float32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 1, 1, 1, 0]);
  });

  // Tensor4D:
  it('Tensor4D - int32', () => {
    let a = tf.tensor4d([1, 4, 5, 8], [2, 2, 1, 1], 'int32');
    let b = tf.tensor4d([2, 3, 6, 7], [2, 2, 1, 1], 'int32');
    let res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0]);

    a = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);

    a = tf.tensor4d([1, 1, 1, 1], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([2, 2, 2, 2], [2, 2, 1, 1], 'int32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('Tensor4D - float32', () => {
    let a = tf.tensor4d([1.1, 4.1, 5.1, 8.1], [2, 2, 1, 1], 'float32');
    let b = tf.tensor4d([2.1, 3.1, 6.1, 7.1], [2, 2, 1, 1], 'float32');
    let res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0]);

    a = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);

    a = tf.tensor4d([0.1, 0.1, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([1.1, 1.1, 1.1, 1.1], [2, 2, 1, 1], 'float32');
    res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('broadcasting Tensor4D shapes - int32', () => {
    const a = tf.tensor4d([1, 2, 5, 9], [2, 2, 1, 1], 'int32');
    const b = tf.tensor4d(
        [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], [2, 2, 1, 2], 'int32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1, 1, 1, 0, 0]);
  });
  it('broadcasting Tensor4D shapes - float32', () => {
    const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d(
        [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
        [2, 2, 1, 2],
        'float32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1, 1, 1, 0, 0]);
  });
  it('NaNs in Tensor4D - float32', () => {
    const a = tf.tensor4d([1.1, NaN, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d([0.1, 1.1, 1.1, NaN], [2, 2, 1, 1], 'float32');
    const res = tf.lessEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 1, 0]);
  });

  it('throws when passed a as a non-tensor', () => {
    expect(() => tf.lessEqual({} as tf.Tensor, tf.scalar(1)))
        .toThrowError(/Argument 'a' passed to 'lessEqual' must be a Tensor/);
  });
  it('throws when passed b as a non-tensor', () => {
    expect(() => tf.lessEqual(tf.scalar(1), {} as tf.Tensor))
        .toThrowError(/Argument 'b' passed to 'lessEqual' must be a Tensor/);
  });
});

describeWithFlags('lessEqualStrict', ALL_ENVS, () => {
  it('Tensor1D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor1d([2]);
        const b = tf.tensor1d([4, 2, -1]);

        expect(() => tf.lessEqualStrict(a, b)).toThrowError();
        expect(() => tf.lessEqualStrict(b, a)).toThrowError();
      });

  // Tensor2D:
  it('Tensor2D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
        const b =
            tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');

        expect(() => tf.lessEqualStrict(a, b)).toThrowError();
        expect(() => tf.lessEqualStrict(b, a)).toThrowError();
      });

  // Tensor3D:
  it('Tensor3D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor3d(
            [
              [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
              [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
            ],
            [2, 3, 2],
            'float32');
        const b = tf.tensor3d(
            [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
            [2, 3, 1],
            'float32');

        expect(() => tf.lessEqualStrict(a, b)).toThrowError();
        expect(() => tf.lessEqualStrict(b, a)).toThrowError();
      });

  // Tensor4D:
  it('Tensor4D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
        const b = tf.tensor4d(
            [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
            [2, 2, 1, 2],
            'float32');

        expect(() => tf.lessEqualStrict(a, b)).toThrowError();
        expect(() => tf.lessEqualStrict(b, a)).toThrowError();
      });
});

describeWithFlags('greater', ALL_ENVS, () => {
  it('Tensor1D - int32', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([2, 3, 5], 'int32');
    let res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0]);

    a = tf.tensor1d([2, 2, 2], 'int32');
    b = tf.tensor1d([2, 2, 2], 'int32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0]);

    a = tf.tensor1d([3, 3], 'int32');
    b = tf.tensor1d([0, 0], 'int32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1]);
  });
  it('Tensor1D - float32', () => {
    let a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    let b = tf.tensor1d([2.2, 3.2, 5.1], 'float32');
    let res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0]);

    a = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    b = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0]);

    a = tf.tensor1d([3.123, 3.321], 'float32');
    b = tf.tensor1d([0.45, 0.123], 'float32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1]);
  });
  it('mismatched Tensor1D shapes - int32', () => {
    const a = tf.tensor1d([1, 2], 'int32');
    const b = tf.tensor1d([1, 2, 3], 'int32');
    const f = () => {
      tf.greater(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatched Tensor1D shapes - float32', () => {
    const a = tf.tensor1d([1.1, 2.1], 'float32');
    const b = tf.tensor1d([1.1, 2.1, 3.1], 'float32');
    const f = () => {
      tf.greater(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([2.1, 3.1, NaN], 'float32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0]);
  });

  // Tensor2D:
  it('Tensor2D - int32', () => {
    let a = tf.tensor2d([[1, 4, 5], [8, 9, 11]], [2, 3], 'int32');
    let b = tf.tensor2d([[2, 3, 6], [7, 10, 11]], [2, 3], 'int32');
    let res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1, 0, 0]);

    a = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    b = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);
  });
  it('Tensor2D - float32', () => {
    let a =
        tf.tensor2d([[1.1, 4.1, 5.1], [8.1, 9.1, 11.1]], [2, 3], 'float32');
    let b =
        tf.tensor2d([[2.1, 3.1, 6.1], [7.1, 10.1, 11.1]], [2, 3], 'float32');
    let res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1, 0, 0]);

    a = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    b = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);
  });
  it('broadcasting Tensor2D shapes - int32', () => {
    const a = tf.tensor2d([[3], [7]], [2, 1], 'int32');
    const b = tf.tensor2d([[2, 3, 4], [7, 8, 9]], [2, 3], 'int32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0, 0, 0]);
  });
  it('broadcasting Tensor2D shapes - float32', () => {
    const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
    const b =
        tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0, 0, 0]);
  });
  it('NaNs in Tensor2D - float32', () => {
    const a = tf.tensor2d([[1.1, NaN], [0.1, NaN]], [2, 2], 'float32');
    const b = tf.tensor2d([[0.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0]);
  });

  // Tensor3D:
  it('Tensor3D - int32', () => {
    let a =
        tf.tensor3d([[[1], [4], [5]], [[8], [9], [11]]], [2, 3, 1], 'int32');
    let b =
        tf.tensor3d(
          [[[2], [3], [6]], [[7], [10], [11]]], [2, 3, 1], 'int32');
    let res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1, 0, 0]);

    a = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    b = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0, 0, 0]);
  });
  it('Tensor3D - float32', () => {
    let a = tf.tensor3d(
        [[[1.1], [4.1], [5.1]], [[8.1], [9.1], [11.1]]],
        [2, 3, 1],
        'float32');
    let b = tf.tensor3d(
        [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [11.1]]],
        [2, 3, 1],
        'float32');
    let res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1, 0, 0]);

    a = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.2]]], [2, 3, 1], 'float32');
    b = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0, 0, 1]);
  });
  it('broadcasting Tensor3D shapes - int32', () => {
    const a = tf.tensor3d(
        [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]], [2, 3, 2],
        'int32');
    const b =
        tf.tensor3d([[[1], [2], [3]], [[7], [10], [9]]], [2, 3, 1], 'int32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1]);
  });
  it('broadcasting Tensor3D float32', () => {
    const a = tf.tensor3d(
        [
          [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
          [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
        ],
        [2, 3, 2],
        'float32');
    const b = tf.tensor3d(
        [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
        [2, 3, 1],
        'float32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1]);
  });
  it('NaNs in Tensor3D - float32', () => {
    const a = tf.tensor3d(
        [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], [2, 3, 1], 'float32');
    const b = tf.tensor3d(
        [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], [2, 3, 1], 'float32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0, 0, 0]);
  });

  // Tensor4D:
  it('Tensor4D - int32', () => {
    let a = tf.tensor4d([1, 4, 5, 8], [2, 2, 1, 1], 'int32');
    let b = tf.tensor4d([2, 3, 6, 8], [2, 2, 1, 1], 'int32');
    let res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 0]);

    a = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);

    a = tf.tensor4d([2, 2, 2, 2], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([1, 1, 1, 1], [2, 2, 1, 1], 'int32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('Tensor4D - float32', () => {
    let a = tf.tensor4d([1.1, 4.1, 5.1, 8.1], [2, 2, 1, 1], 'float32');
    let b = tf.tensor4d([2.1, 3.1, 6.1, 8.1], [2, 2, 1, 1], 'float32');
    let res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 0]);

    a = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);

    a = tf.tensor4d([1.1, 1.1, 1.1, 1.1], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 0.1, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('broadcasting Tensor4D shapes - int32', () => {
    const a = tf.tensor4d([1, 2, 5, 9], [2, 2, 1, 1], 'int32');
    const b = tf.tensor4d(
        [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], [2, 2, 1, 2], 'int32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0, 0, 0, 1, 1]);
  });
  it('broadcasting Tensor4D shapes - float32', () => {
    const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d(
        [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
        [2, 2, 1, 2],
        'float32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0, 0, 0, 1, 1]);
  });
  it('NaNs in Tensor4D - float32', () => {
    const a = tf.tensor4d([1.1, NaN, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d([0.1, 1.1, 1.1, NaN], [2, 2, 1, 1], 'float32');
    const res = tf.greater(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0]);
  });

  it('throws when passed a as a non-tensor', () => {
    expect(() => tf.greater({} as tf.Tensor, tf.scalar(1)))
        .toThrowError(/Argument 'a' passed to 'greater' must be a Tensor/);
  });
  it('throws when passed b as a non-tensor', () => {
    expect(() => tf.greater(tf.scalar(1), {} as tf.Tensor))
        .toThrowError(/Argument 'b' passed to 'greater' must be a Tensor/);
  });
});

describeWithFlags('greaterStrict', ALL_ENVS, () => {
  it('Tensor1D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor1d([2]);
        const b = tf.tensor1d([4, 2, -1]);

        expect(() => tf.greaterStrict(a, b)).toThrowError();
        expect(() => tf.greaterStrict(b, a)).toThrowError();
      });

  // Tensor2D:
  it('Tensor2D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
        const b =
            tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');

        expect(() => tf.greaterStrict(a, b)).toThrowError();
        expect(() => tf.greaterStrict(b, a)).toThrowError();
      });

  // Tensor3D:
  it('Tensor3D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor3d(
            [
              [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
              [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
            ],
            [2, 3, 2],
            'float32');
        const b = tf.tensor3d(
            [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
            [2, 3, 1],
            'float32');

        expect(() => tf.greaterStrict(a, b)).toThrowError();
        expect(() => tf.greaterStrict(b, a)).toThrowError();
      });

  // Tensor4D:
  it('Tensor4D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
        const b = tf.tensor4d(
            [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
            [2, 2, 1, 2],
            'float32');

        expect(() => tf.greaterStrict(a, b)).toThrowError();
        expect(() => tf.greaterStrict(b, a)).toThrowError();
      });
});

describeWithFlags('greaterEqual', ALL_ENVS, () => {
  // Tensor1D:
  it('Tensor1D - int32', () => {
    let a = tf.tensor1d([1, 4, 5], 'int32');
    let b = tf.tensor1d([2, 3, 5], 'int32');
    let res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 1]);

    a = tf.tensor1d([2, 2, 2], 'int32');
    b = tf.tensor1d([2, 2, 2], 'int32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1]);

    a = tf.tensor1d([0, 0], 'int32');
    b = tf.tensor1d([3, 3], 'int32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0]);
  });
  it('Tensor1D - float32', () => {
    let a = tf.tensor1d([1.1, 4.1, 5.1], 'float32');
    let b = tf.tensor1d([2.2, 3.2, 5.1], 'float32');
    let res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 1]);

    a = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    b = tf.tensor1d([2.31, 2.31, 2.31], 'float32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1]);

    a = tf.tensor1d([0.45, 0.123], 'float32');
    b = tf.tensor1d([3.123, 3.321], 'float32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0]);
  });
  it('mismatched Tensor1D shapes - int32', () => {
    const a = tf.tensor1d([1, 2], 'int32');
    const b = tf.tensor1d([1, 2, 3], 'int32');
    const f = () => {
      tf.greaterEqual(a, b);
    };
    expect(f).toThrowError();
  });
  it('mismatched Tensor1D shapes - float32', () => {
    const a = tf.tensor1d([1.1, 2.1], 'float32');
    const b = tf.tensor1d([1.1, 2.1, 3.1], 'float32');
    const f = () => {
      tf.greaterEqual(a, b);
    };
    expect(f).toThrowError();
  });
  it('NaNs in Tensor1D - float32', () => {
    const a = tf.tensor1d([1.1, NaN, 2.1], 'float32');
    const b = tf.tensor1d([2.1, 3.1, NaN], 'float32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0]);
  });

  // Tensor2D:
  it('Tensor2D - int32', () => {
    let a = tf.tensor2d([[1, 4, 5], [8, 9, 12]], [2, 3], 'int32');
    let b = tf.tensor2d([[2, 3, 6], [7, 10, 11]], [2, 3], 'int32');
    let res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1, 0, 1]);

    a = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    b = tf.tensor2d([[0, 0], [1, 1]], [2, 2], 'int32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('Tensor2D - float32', () => {
    let a =
        tf.tensor2d([[1.1, 4.1, 5.1], [8.1, 9.1, 12.1]], [2, 3], 'float32');
    let b =
        tf.tensor2d([[2.1, 3.1, 6.1], [7.1, 10.1, 11.1]], [2, 3], 'float32');
    let res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1, 0, 1]);

    a = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    b = tf.tensor2d([[0.2, 0.2], [1.2, 1.2]], [2, 2], 'float32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);
  });
  it('broadcasting Tensor2D shapes - int32', () => {
    const a = tf.tensor2d([[3], [7]], [2, 1], 'int32');
    const b = tf.tensor2d([[2, 3, 4], [7, 8, 9]], [2, 3], 'int32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 0, 1, 0, 0]);
  });
  it('broadcasting Tensor2D shapes - float32', () => {
    const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
    const b =
        tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 0, 1, 0, 0]);
  });
  it('NaNs in Tensor2D - float32', () => {
    const a = tf.tensor2d([[1.1, NaN], [0.1, NaN]], [2, 2], 'float32');
    const b = tf.tensor2d([[0.1, NaN], [1.1, NaN]], [2, 2], 'float32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0]);
  });

  // Tensor3D:
  it('Tensor3D - int32', () => {
    let a =
        tf.tensor3d([[[1], [4], [5]], [[8], [9], [12]]], [2, 3, 1], 'int32');
    let b =
        tf.tensor3d(
          [[[2], [3], [6]], [[7], [10], [11]]], [2, 3, 1], 'int32');
    let res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1, 0, 1]);

    a = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    b = tf.tensor3d([[[0], [0], [0]], [[1], [1], [1]]], [2, 3, 1], 'int32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1, 1, 1]);
  });
  it('Tensor3D - float32', () => {
    let a = tf.tensor3d(
       [[[1.1], [4.1], [5.1]], [[8.1], [9.1], [12.1]]], [2, 3, 1],
        'float32');
    let b = tf.tensor3d(
        [[[2.1], [3.1], [6.1]], [[7.1], [10.1], [11.1]]],
        [2, 3, 1],
        'float32');
    let res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1, 0, 1]);

    a = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.2]]], [2, 3, 1], 'float32');
    b = tf.tensor3d(
        [[[0.1], [0.1], [0.1]], [[1.1], [1.1], [1.1]]], [2, 3, 1], 'float32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1, 1, 1]);
  });
  it('broadcasting Tensor3D shapes - int32', () => {
    const a = tf.tensor3d(
        [[[1, 0], [2, 3], [4, 5]], [[6, 7], [9, 8], [10, 11]]],
        [2, 3, 2],
        'int32');
    const b =
        tf.tensor3d([[[1], [2], [3]], [[7], [10], [9]]], [2, 3, 1], 'int32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1]);
  });
  it('broadcasting Tensor3D float32', () => {
    const a = tf.tensor3d(
        [
          [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
          [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
        ],
        [2, 3, 2],
        'float32');
    const b = tf.tensor3d(
        [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
        [2, 3, 1],
        'float32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1]);
  });
  it('NaNs in Tensor3D - float32', () => {
    const a = tf.tensor3d(
        [[[1.1], [NaN], [1.1]], [[0.1], [0.1], [0.1]]], [2, 3, 1], 'float32');
    const b = tf.tensor3d(
        [[[0.1], [0.1], [1.1]], [[1.1], [0.1], [NaN]]], [2, 3, 1], 'float32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 1, 0, 1, 0]);
  });

  // Tensor4D:
  it('Tensor4D - int32', () => {
    let a = tf.tensor4d([1, 4, 5, 8], [2, 2, 1, 1], 'int32');
    let b = tf.tensor4d([2, 3, 6, 7], [2, 2, 1, 1], 'int32');
    let res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1]);

    a = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([0, 1, 2, 3], [2, 2, 1, 1], 'int32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);

    a = tf.tensor4d([1, 1, 1, 1], [2, 2, 1, 1], 'int32');
    b = tf.tensor4d([2, 2, 2, 2], [2, 2, 1, 1], 'int32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);
  });
  it('Tensor4D - float32', () => {
    let a = tf.tensor4d([1.1, 4.1, 5.1, 8.1], [2, 2, 1, 1], 'float32');
    let b = tf.tensor4d([2.1, 3.1, 6.1, 7.1], [2, 2, 1, 1], 'float32');
    let res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 1, 0, 1]);

    a = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([0.1, 1.1, 2.2, 3.3], [2, 2, 1, 1], 'float32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 1, 1, 1]);

    a = tf.tensor4d([0.1, 0.1, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    b = tf.tensor4d([1.1, 1.1, 1.1, 1.1], [2, 2, 1, 1], 'float32');
    res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [0, 0, 0, 0]);
  });
  it('broadcasting Tensor4D shapes - int32', () => {
    const a = tf.tensor4d([1, 2, 5, 9], [2, 2, 1, 1], 'int32');
    const b = tf.tensor4d(
        [[[[1, 2]], [[3, 4]]], [[[5, 6]], [[7, 8]]]], [2, 2, 1, 2], 'int32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0, 1, 0, 1, 1]);
  });
  it('broadcasting Tensor4D shapes - float32', () => {
    const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d(
        [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
        [2, 2, 1, 2],
        'float32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0, 1, 0, 1, 1]);
  });
  it('NaNs in Tensor4D - float32', () => {
    const a = tf.tensor4d([1.1, NaN, 0.1, 0.1], [2, 2, 1, 1], 'float32');
    const b = tf.tensor4d([0.1, 1.1, 1.1, NaN], [2, 2, 1, 1], 'float32');
    const res = tf.greaterEqual(a, b);

    expect(res.dtype).toBe('bool');
    expectArraysClose(res, [1, 0, 0, 0]);
  });

  it('throws when passed a as a non-tensor', () => {
    expect(() => tf.greaterEqual({} as tf.Tensor, tf.scalar(1)))
        .toThrowError(/Argument 'a' passed to 'greaterEqual' must be a Tensor/);
  });
  it('throws when passed b as a non-tensor', () => {
    expect(() => tf.greaterEqual(tf.scalar(1), {} as tf.Tensor))
        .toThrowError(/Argument 'b' passed to 'greaterEqual' must be a Tensor/);
  });
});

describeWithFlags('greaterEqualStrict', ALL_ENVS, () => {
  it('Tensor1D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor1d([2]);
        const b = tf.tensor1d([4, 2, -1]);

        expect(() => tf.greaterEqualStrict(a, b)).toThrowError();
        expect(() => tf.greaterEqualStrict(b, a)).toThrowError();
      });

  // Tensor2D:
  it('Tensor2D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor2d([[1.1], [7.1]], [2, 1], 'float32');
        const b =
            tf.tensor2d([[0.1, 1.1, 2.1], [7.1, 8.1, 9.1]], [2, 3], 'float32');

        expect(() => tf.greaterEqualStrict(a, b)).toThrowError();
        expect(() => tf.greaterEqualStrict(b, a)).toThrowError();
      });

  // Tensor3D:
  it('Tensor3D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor3d(
            [
              [[1.1, 0.1], [2.1, 3.1], [4.1, 5.1]],
              [[6.1, 7.1], [9.1, 8.1], [10.1, 11.1]]
            ],
            [2, 3, 2],
            'float32');
        const b = tf.tensor3d(
            [[[1.1], [2.1], [3.1]], [[7.1], [10.1], [9.1]]],
            [2, 3, 1],
            'float32');

        expect(() => tf.greaterEqualStrict(a, b)).toThrowError();
        expect(() => tf.greaterEqualStrict(b, a)).toThrowError();
      });

  // Tensor4D:
  it('Tensor4D - strict version throws when a and b are different shape',
      () => {
        const a = tf.tensor4d([1.1, 2.1, 5.1, 9.1], [2, 2, 1, 1], 'float32');
        const b = tf.tensor4d(
            [[[[1.1, 2.1]], [[3.1, 4.1]]], [[[5.1, 6.1]], [[7.1, 8.1]]]],
            [2, 2, 1, 2],
            'float32');

        expect(() => tf.greaterEqualStrict(a, b)).toThrowError();
        expect(() => tf.greaterEqualStrict(b, a)).toThrowError();
      });
});
