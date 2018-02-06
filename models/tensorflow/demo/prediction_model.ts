import {Array1D, NDArray, NDArrayMath} from 'deeplearn';

import * as model_util from '../../util';
import {TensorflowModel} from '../src/index';
import * as util from '../src/util';

import {IMAGENET_CLASSES} from './imagenet_classes';

/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

const GOOGLE_CLOUD_STORAGE_DIR =
    'https://storage.googleapis.com/learnjs-data/tf_model_zoo/';

export class PredictionModel {
  private model: TensorflowModel;
  constructor(protected math: NDArrayMath, private filePath: string) {}
  /**
   * Loads necessary variables for SqueezeNet.
   */
  async load(): Promise<void> {
    this.model = new TensorflowModel(
        util.loadRemoteProtoFile(GOOGLE_CLOUD_STORAGE_DIR + this.filePath),
        this.math);
    return this.model.load();
  }
  /**
   * Infer through SqueezeNet, assumes variables have been loaded. This does
   * standard ImageNet pre-processing before inferring through the model. This
   * method returns named activations as well as pre-softmax logits.
   *
   * @param input un-preprocessed input Array.
   * @return The pre-softmax logits.
   */
  predict(input: NDArray, feedDicts: {[key: string]: NDArray}): Array1D {
    return this.math.scope(() => {
      return this.model.predict(feedDicts) as Array1D;
    });
  }

  /**
   * Get the topK classes for pre-softmax logits. Returns a map of className
   * to softmax normalized probability.
   *
   * @param logits Pre-softmax logits array.
   * @param topK How many top classes to return.
   */
  async getTopKClasses(logits: Array1D, topK: number, offset = 0):
      Promise<{[className: string]: number}> {
    const predictions = this.math.scope(() => {
      return this.math.softmax(logits).asType('float32');
    });
    const topk = model_util.topK(await predictions.data(), topK);
    predictions.dispose();
    const topkIndices = topk.indices;
    const topkValues = topk.values;

    const topClassesToProbability: {[className: string]: number} = {};
    for (let i = 0; i < topkIndices.length; i++) {
      topClassesToProbability[IMAGENET_CLASSES[topkIndices[i] + offset]] =
          topkValues[i];
    }
    return topClassesToProbability;
  }
}
