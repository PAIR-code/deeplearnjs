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

import {Scalar, Tensor} from '../tensor';
import {arraysEqual} from '../util';

import {randomUniform} from './array_ops';
import {div, sub} from './binary_ops';
import {op} from './operation';
import {step} from './unary_ops';

/**
 * Sets entries in `x` to zero at random, while scaling the entire tensor.
 * ```js
 * const x = tf.dropout([1, 2, 3, 4]);
 * const rate = 0.5;
 * const noiseShape = null || x.shape;
 * const tensor = tf.dropout(x, rate, noiseShape);
 * ```
 * @param x input tensor.
 * @param level fraction of the entries in the tensor that will be set to 0.
 * @param noiseShape shape of randomly generated keep/drop flags, must be
 *   broadcastable to the shape of `x`.
 * @param seed random seed to ensure determinism.
 * @returns Result of the dropout operation.
 */
function dropout_(
    x: Tensor, level: Scalar, noiseShape?: number[], seed?: number): Tensor {
  if (noiseShape != null && !arraysEqual(x.shape, noiseShape)) {
    // TODO: implement non default noise shape (VariableVasasMT)
    throw new Error(
        'Non-default noise shape is not implemented yet: ' +
        JSON.stringify(noiseShape));
  }
  if (seed != null) {
    throw new Error('seed is not implemented for dropout yet.');
  }
  let multiplier = step(sub(randomUniform(x.shape, 0, 1, 'float32'), level));
  // Scale the kept elements, so the expected sum is unchanged.
  multiplier = (div(1, sub(1, level)) as Scalar).mul(multiplier);
  return x.mul(multiplier);
}

export const dropout = op({dropout_});
