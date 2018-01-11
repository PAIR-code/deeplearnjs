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

import {Scalar} from '../../ndarray';

import {GPGPUProgram} from './gpgpu_math';

export class Pad1DProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[];
  userCode: string;
  rank: number;

  constructor(
      xShape: number[], paddings: [number, number], constantValues?: Scalar) {
    const leftPadding = paddings[0];
    const rightPadding = paddings[1];
    const constant = getConstantFloatingStr(constantValues);

    this.outputShape = [leftPadding + xShape[0] + rightPadding];
    this.rank = 1;

    this.userCode = `
      void main() {
        int resRC = getOutputCoords();
        if (resRC < ${leftPadding} || resRC >= ${leftPadding} + ${xShape[0]}) {
          setOutput(${constant});
        } else {
          setOutput(getX(resRC - ${leftPadding}));
        }
      }
    `;
  }
}

export class Pad2DProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[];
  userCode: string;
  rank: number;

  constructor(
      xShape: number[], paddings: Array<[number, number]>,
      constantValues?: Scalar) {
    const topPadding = paddings[0][0];
    const bottomPadding = paddings[0][1];
    const leftPadding = paddings[1][0];
    const rightPadding = paddings[1][1];
    const constant = getConstantFloatingStr(constantValues);

    this.outputShape = [
      topPadding + xShape[0] + bottomPadding,
      leftPadding + xShape[1] + rightPadding
    ];
    this.rank = 2;

    const sourceCoords = `resRC.x - ${topPadding}, resRC.y - ${leftPadding}`;

    this.userCode = `
      void main() {
        ivec2 resRC = getOutputCoords();
        int topShape = ${topPadding} + ${xShape[0]};
        int leftShape = ${leftPadding} + ${xShape[1]};
        if (resRC.x < ${topPadding} || resRC.x >= topShape ||
            resRC.y < ${leftPadding} || resRC.y >= leftShape) {
          setOutput(${constant});
        } else {
          setOutput(getX(${sourceCoords}));
        }
      }
    `;
  }
}

function getConstantFloatingStr(constantValues?: Scalar) {
  if (constantValues !== undefined) {
    const constant = constantValues.get().toString();
    if (constant.indexOf('.') === -1) {
      return constant + '.0';
    }
    return constant;
  } else {
    return '0.0';
  }
}
