/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

import * as util from '../../util';
import {getChannels} from '../packing_util';

import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';
import * as shader_util from './shader_compiler_util';

export class ReshapePackedProgram implements GPGPUProgram {
  variableNames = ['A'];
  usesPackedTextures = true;
  outputShape: number[];
  userCode: string;

  constructor(outputShape: [number, number, number], inputShape: [
    number, number, number
  ]) {
    this.outputShape = outputShape;
    const rank = outputShape.length;
    const dtype = getCoordsDataType(rank);
    const innerDims = ['thisRC.y', 'thisRC.z'];

    const inputRank = inputShape.length;
    const inputDtype = getCoordsDataType(inputRank);

    let inputRCInnerDims = `vec2(${
        getChannels('inputRC', inputRank)
            .slice(-2)
            .map(d => `float(${d})`)
            .join(',')});
    `;

    const mainLoop = getMainLoop(
        dtype, innerDims, outputShape.slice(-2), inputDtype, inputRCInnerDims);

    this.userCode = `
      ${getReshapedInputCoords(inputShape)}
      ${getFlatIndex(outputShape)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ${mainLoop}

        setOutput(result);
      }
    `;
  }
}

function getMainLoop(
    dtype: string, innerDims: string[], shapeInnerDims: number[],
    inputDtype: string, inputRCInnerDims: string) {
  const channels = 4;
  const outCoordRow = innerDims[0];
  const outCoordCol = innerDims[1];
  const inBoundsCheck = `${outCoordRow} < ${shapeInnerDims[0]} && ${
      outCoordCol} < ${shapeInnerDims[1]}`;

  let result = `ivec3 thisRC;`;
  for (let i = 0; i < channels; i++) {
    let thisRC = `thisRC = rc;`;
    if (i % 2 === 1) {
      thisRC += `${outCoordCol} += 1;`;
    }
    if (i > 1) {
      thisRC += `${outCoordRow} += 1;`;
    }

    result += `
      ${thisRC}
      ${i > 0 ? `if(${inBoundsCheck}){` : ''}
        int flatIndex = getFlatIndex(thisRC);

        ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
        vec2 inputRCInnerDims = ${inputRCInnerDims};

        result[${
        i}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
      ${i > 0 ? '}' : ''}
    `;
  }

  return result;
}

function getFlatIndex(shape: number[]): string {
  const rank = shape.length;
  util.assert(rank < 7, `Packed ${rank}-D flat indexing is not yet supported`);

  const funcName = 'getFlatIndex';

  if (rank === 1) {
    return `
      int ${funcName}(int coords) {
        return coords;
      }
    `;
  }

  const strides = shader_util.getStrides(shape);
  const coords =
      ['x', 'y', 'z', 'w', 'u', 'v'].slice(0, rank).map(d => `coords.${d}`);
  const dotCoordsWithStrides =
      shader_util.dotify(coords, strides.map(d => d.toString()).concat(['1.']));

  return `
    int ${funcName}(ivec3 coords) {
      return round(${dotCoordsWithStrides});
    }
  `;
}

function getReshapedInputCoords(shape: number[]): string {
  const rank = shape.length;
  util.assert(rank < 7, `Packed ${rank}-D reshaping is not yet supported`);

  const funcName = 'inputCoordsFromReshapedOutCoords';

  if (rank === 1) {
    return `
      int ${funcName}(int index) {
        return index;
      }
    `;
  }

  const dims = ['r', 'c', 'd', 'd2', 'd3', 'd4'].slice(0, rank);
  const coordsFromIndexSnippet =
      shader_util.getLogicalCoordinatesFromFlatIndex(dims, shape);

  return `
    ivec${rank} ${funcName}(int index) {
      ${coordsFromIndexSnippet}
      return ivec${rank}(${dims.join(',')});
    }
  `;
}