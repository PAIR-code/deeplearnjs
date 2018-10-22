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

import * as tf from './index';
import {BackendTimer, BackendTimingInfo} from './kernels/backend';
import {TypedArray} from './kernels/webgl/tex_util';
import {Logger, Profiler} from './profiler';
import {Tensor} from './tensor';

class TestBackendTimer implements BackendTimer {
  private counter = 1;
  constructor(private delayMs: number, private queryTimeMs: number) {}

  async time(query: () => void): Promise<BackendTimingInfo> {
    query();
    const kernelMs = await new Promise<number>(
        resolve => setTimeout(
            resolve(this.queryTimeMs * this.counter++), this.delayMs));
    return {kernelMs};
  }
}

class TestLogger extends Logger {
  logKernelProfile(
      name: string, result: Tensor, vals: TypedArray, timeMs: number) {}
}

describe('profiler.Profiler', () => {
  it('profiles simple function', doneFn => {
    const delayMs = 5;
    const queryTimeMs = 10;
    const timer = new TestBackendTimer(delayMs, queryTimeMs);
    const logger = new TestLogger();
    const profiler = new Profiler(timer, logger);

    spyOn(timer, 'time').and.callThrough();
    spyOn(logger, 'logKernelProfile').and.callThrough();

    const timeSpy = timer.time as jasmine.Spy;
    const logKernelProfileSpy = logger.logKernelProfile as jasmine.Spy;

    let kernelCalled = false;
    const result = 1;
    const resultScalar = tf.scalar(result);

    profiler.profileKernel('MatMul', () => {
      kernelCalled = true;
      return resultScalar;
    });

    setTimeout(() => {
      expect(timeSpy.calls.count()).toBe(1);

      expect(logKernelProfileSpy.calls.count()).toBe(1);
      expect(logKernelProfileSpy.calls.first().args).toEqual([
        'MatMul', resultScalar, new Float32Array([result]), queryTimeMs,
        undefined
      ]);

      expect(kernelCalled).toBe(true);
      doneFn();
    }, delayMs * 2);
  });

  it('profiles nested kernel', doneFn => {
    const delayMs = 5;
    const queryTimeMs = 10;
    const timer = new TestBackendTimer(delayMs, queryTimeMs);
    const logger = new TestLogger();
    const profiler = new Profiler(timer, logger);

    spyOn(timer, 'time').and.callThrough();
    spyOn(logger, 'logKernelProfile').and.callThrough();
    const timeSpy = timer.time as jasmine.Spy;
    const logKernelProfileSpy = logger.logKernelProfile as jasmine.Spy;

    let matmulKernelCalled = false;
    let maxKernelCalled = false;
    const result = 1;
    const resultScalar = tf.scalar(result);

    profiler.profileKernel('MatMul', () => {
      const result = profiler.profileKernel('Max', () => {
        maxKernelCalled = true;
        return resultScalar;
      });
      matmulKernelCalled = true;
      return result;
    });

    setTimeout(() => {
      expect(timeSpy.calls.count()).toBe(2);

      expect(logKernelProfileSpy.calls.count()).toBe(2);
      expect(logKernelProfileSpy.calls.first().args).toEqual([
        'Max', resultScalar, new Float32Array([result]), queryTimeMs, undefined
      ]);
      expect(logKernelProfileSpy.calls.argsFor(1)).toEqual([
        'MatMul', resultScalar, new Float32Array([result]), queryTimeMs * 2,
        undefined
      ]);

      expect(matmulKernelCalled).toBe(true);
      expect(maxKernelCalled).toBe(true);
      doneFn();
    }, delayMs * 2);
  });
});
