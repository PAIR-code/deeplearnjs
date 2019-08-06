import {ENGINE} from '../engine';
import {Tensor} from '../tensor';
import {convertToTensor} from '../tensor_util_env';
import {op} from './operation';

/**
 * Returns a diagonal tensor with a given diagonal values.
 *
 * Given a diagonal, this operation returns a tensor with the diagonal and
 * everything else padded with zeros.
 *
 * Assume the input has dimensions `[D1,..., Dk]`, then the output is a tensor
 * of rank 2k with dimensions `[D1,..., Dk, D1,..., Dk]`
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3, 4]);
 *
 * tf.diag(x).print()
 * ```
 * ```js
 * const x = tf.tensor1d([1, 2, 3, 4, 5, 6, 6, 8], [4, 2])
 *
 * tf.diag(x).print()
 * ```
 * @param x The input tensor.
 */
function diag_(x: Tensor): Tensor {
  const $x = convertToTensor(x, 'x', 'diag').flatten();
  const outShape = [...x.shape, ...x.shape];
  return ENGINE.runKernel(backend => backend.diag($x), {$x}).reshape(outShape);
}

export const diag = op({diag_});
