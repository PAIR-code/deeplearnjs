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

import {ENGINE} from './engine';
import {setTestEnvs} from './jasmine_util';

// tslint:disable-next-line:no-require-imports
const jasmine = require('jasmine');

process.on('unhandledRejection', e => {
  throw e;
});

setTestEnvs(
    [{name: 'node', factory: ENGINE.findBackendFactory('cpu'), flags: {}}]);

const runner = new jasmine();
runner.loadConfig({spec_files: ['dist/**/**_test.js'], random: false});
runner.execute();
