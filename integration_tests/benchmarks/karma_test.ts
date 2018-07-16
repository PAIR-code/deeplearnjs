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
import {MatmulGPUBenchmark} from './matmul_benchmarks';

// tslint:disable-next-line:no-any
declare let __karma__: any;

describe('benchmarks', () => {
  it('test', async () => {
    const matmulGPU = new MatmulGPUBenchmark();

    const sizes = [1, 100, 400, 1000, 5000];
    console.log('-------------matmul benchmark------------');
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const result = await matmulGPU.run(size);

      console.log(`[${size}]: ${result}`);
    }
    console.log('-----------------------------------------');
  });
});
