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
import {operation} from './decorators';
import {Array3D, Array4D} from './ndarray';

export class Ops {
  /**
   * Bilinear resize a batch of 3D images to a new shape.
   *
   * @param images The images, of rank 4 or rank 3, of shape
   *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is assumed.
   * @param newShape2D The new shape `[newHeight, newWidth]` to resize the
   *     images to. Each channel is resized individually.
   * @param alignCorners An optional bool. Defaults to False. If true, rescale
   *     input by (new_height - 1) / (height - 1), which exactly aligns the 4
   *     corners of images and resized images. If false, rescale by
   *     new_height/height. Treat similarly the width dimension.
   */
  @operation
  static resizeBilinear<T extends Array3D|Array4D>(
      images: T, newShape2D: [number, number], alignCorners = false): T {
    util.assert(
        images.rank === 3 || images.rank === 4,
        `Error in resizeBilinear: x must be rank 3 or 4, but got ` +
            `rank ${images.rank}.`);
    util.assert(
        newShape2D.length === 2,
        `Error in resizeBilinear: new shape must 2D, but got shape ` +
            `${newShape2D}.`);
    let batchImages = images as Array4D;
    let reshapedTo4D = false;
    if (images.rank === 3) {
      reshapedTo4D = true;
      batchImages =
          images.as4D(1, images.shape[0], images.shape[1], images.shape[2]);
    }
    const [newHeight, newWidth] = newShape2D;
    const res = ENV.engine.executeKernel(
        'ResizeBilinear',
        {inputs: {x: batchImages}, args: {newHeight, newWidth, alignCorners}});
    if (reshapedTo4D) {
      return res.as3D(res.shape[1], res.shape[2], res.shape[3]) as T;
    }
    return res as T;
  }
}
