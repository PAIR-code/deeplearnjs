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

import * as util from '../../util';
import {NDArray} from '../ndarray';
import {TypedArray} from '../types';

import {BackendTimer} from './backend';
import {Kernel} from './kernel_registry';

export class Profiler {
  // private pendingTimer: Promise<number>;
  // private pendingKernel = false;

  constructor(private backendTimer: BackendTimer, private logger?: Logger) {
    if (logger == null) {
      this.logger = new Logger();
    }
  }

  profileKernel<T extends NDArray>(kernelName: Kernel, f: () => T): T {
    let result: T;
    const wrapperFn = () => {
      result = f();
    };
    const timer = this.backendTimer.time(wrapperFn);

    const vals = result.dataSync();
    util.checkForNaN(vals, result.dtype, name);

    timer.then((timeMs: number) => {
      this.logger.logKernelProfile(kernelName, result, vals, timeMs);
    });

    return result as T;

    // let result: NDArray;

    // const shouldTimeKernel = this.pendingKernel === false;

    // let query: {};
    // if (shouldTimeKernel) {
    //   query = this.backendTimer.startTimer();
    //   this.pendingKernel = true;
    // }

    // result = f();

    // if (shouldTimeKernel) {
    //   query = this.backendTimer.endTimer(query);
    //   this.pendingKernel = false;
    // }

    // if (shouldTimeKernel) {
    //   const vals = result.dataSync();
    //   util.checkForNaN(vals, result.dtype, name);

    //   const profile = (timeMs: number) => {
    //     this.logger.logKernelProfile(kernelName, result, vals, timeMs);
    //   };

    //   if (this.pendingTimer == null) {
    //     this.pendingTimer = this.backendTimer.getQueryTime(query);
    //     this.pendingTimer.then(timeMs => {
    //       profile(timeMs);
    //       this.pendingTimer = null;
    //     });
    //   } else {
    //     this.pendingTimer.then(
    //         () => this.backendTimer.getQueryTime(query).then(profile));
    //   }
    // }

    // return result as T;
  }
}

export class Logger {
  logKernelProfile(
      kernelName: Kernel, result: NDArray, vals: TypedArray, timeMs: number) {
    const time = util.rightPad(`${timeMs}ms`, 9);
    const paddedName = util.rightPad(kernelName, 25);
    const rank = result.rank;
    const size = result.size;
    const shape = util.rightPad(result.shape.toString(), 14);
    console.log(
        `%c${paddedName}\t%c${time}\t%c${rank}D ${shape}\t%c${size}`,
        'font-weight:bold', 'color:red', 'color:blue', 'color: orange');
  }
}
